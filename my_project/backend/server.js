
const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pong.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

require('dotenv').config();


db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- AUTH
  provider TEXT NOT NULL,           -- local / google / 42
  provider_id TEXT UNIQUE,          -- OAuth ID
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,

  -- PROFILE
  username TEXT UNIQUE NOT NULL,
  firstname TEXT,
  lastname TEXT,
  avatar_url TEXT DEFAULT 'default-avatar.png',

  -- 2FA
  twofa_enabled BOOLEAN DEFAULT 0,
  twofa_method TEXT,                -- 'email' or 'totp'
  twofa_secret TEXT,                -- for authenticator app
  twofa_email_code TEXT,            -- hashed OTP
  twofa_email_expires INTEGER,       -- expiration timestamp

  -- META
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  `);
});

fastify.register(require('@fastify/cors'), {
  //origin: true
  origin: 'http://localhost:5173',
  credentials: true,               // obligatoire pour cookie
  methods: ['GET','POST','PATCH','DELETE']
});

fastify.register(require('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET
  });
  fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
});


// Add a preHandler hook for authentication
// fastify.addHook('preHandler', async (request, reply) => {
//   try {
//     // This will decode and verify the JWT, and populate request.user
//     request.user = await request.jwtVerify();
//   } catch (err) {
//     return reply.code(401).send({ error: 'Unauthorized' });
//   }
// });


// fastify.decorate('authenticate',async (request, reply) => {
//     await request.jwtVerify();
//   }
//);
//==========>helper function for database

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// 1 - siginup >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.post('/api/signup', async (request, reply) => {
  const { firstname, lastname, username, email, password } = request.body;
  
  if (!username || !email || !password) {
    return reply.code(400).send({ error: 'Username, email and password required' });
  }// hadi rah kayna heta fal front kantcheki 3liha  okayna heta hna
  
  try {
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUser) {
      return reply.code(400).send({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await dbRun(
      `INSERT INTO users (provider, firstname, lastname, username, email, password_hash) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['local', firstname, lastname, username, email, hashedPassword]
    );
    return reply.code(201).send({
      success: true,
      userId: result.lastID,
      message: 'User registered'
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return reply.code(500).send({ error: 'Database error' });
  }
});

// 2 - login >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  fastify.post('/api/login', async (request, reply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.code(400).send({ error: 'Email and password required' });
  }

  try {
      const user = await dbGet('SELECT * FROM users WHERE email = ?',[email]);

    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
 
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    //hna gadit jwt dial authentication
    const SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // console.log("~~~~~~@token :");
    // console.log(token);
    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60
    });

    return reply.send({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

//jadid (**) hhh
//    <-{  }->
//cute hhh

// 3 - profile >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.get('/api/profile' , async (request, reply) => {
  const token= request.cookies.access_token;
  if(!token)
    return reply.code(401).send({error: 'Not authenticated'});
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
        return reply.send({
      success: true,
      message: 'Profile fetched successfully',
      user: {
        id: payload.id,
        username: payload.username
      }
    });
  }
  catch(err) {
    return reply.code(401).send({error: 'Invalid or expired token'})
  }
});


// 4 - update profile >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

fastify.patch('/api/profile', async(request, reply) => {
  const token = request.cookies.access_token;
  if(!token) {
    return reply.code(401).send({error : 'Not authenticated'});
  }
  let payload;
  try{
    payload = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch {
    return reply.code(401).send({error : 'Invalid or expired token'});
  }
  try {

    const {firstname, lastname, username, email} =request.body;
    if (username || email) 
    {
      const existingUser = await dbGet(`
        SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
        [email || '', username || '', payload.id]);
        if(existingUser) 
        {
          return reply.code(400).send({error: 'Email or username already in use'});
        }
    }
  
    const fields = [];
    const values = [];
     if (firstname) {fields.push('firstname = ?'); values.push(firstname);}
    if (lastname) {fields.push('lastname = ?'); values.push(lastname);}
    if (username) {fields.push('username = ?'); values.push(username);}
    if (email) {fields.push('email = ?'); values.push(email);}
  
    if (fields.length === 0)
      return reply.code(400).send({ error: 'No fields to update' });
  
    values.push(payload.id);
    await dbRun(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,values
    );
    const updatedUser = await dbGet (
      `SELECT id, firstname, lastname, username, email FROM users WHERE id = ?`, [payload.id]
    );
  
    return reply.send({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  }
  catch (err) {
        console.error(err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

//5 - remote auth with google >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//✔ User clicks “Login with Google”
//✔ Backend redirects user to Google
fastify.get('/api/auth/google', async (request, reply) => {
  const url ='https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({ //OAuth parameters are NOT JavaScript variables They are PROTOCOL KEYS
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:3010/api/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
    });
  reply.redirect(url);
});

fastify.get('/api/auth/google/callback' , async(request , reply) => {
const  code  = request.query.code;
if (!code) {
  return reply.code(400).send({error: 'No authorization code'});
}
  console.log('!!!!!!!!!!!!Authorization code:::::::::::::::::::::::::::::', code);
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:3010/api/auth/google/callback',
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log('tokenData:', tokenData);

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}`},
    }
  );
  console.error('data lijaya men googl ^^^^^^^^^^^^', userResponse);
  const userGoogle = await userResponse.json();
 // console.log('userGoogle:', userGoogle);
 let user = await dbGet('SELECT * FROM users WHERE provider = ? AND provider_id = ?',
    ['google', userGoogle.id]);

  if (!user) {

    await dbRun (
      `INSERT INTO users (provider, provider_id, username, firstname, lastname, email, password_hash, avatar_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'google',
        userGoogle.id,
        userGoogle.name || 'user' + Date.now(),
        userGoogle.given_name || '',
        userGoogle.family_name || '',
        userGoogle.email,
        'OAUTH_USER',
        userGoogle.picture || 'default-avatar.png'
      ] 
    );

    user = await dbGet(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      ['google', userGoogle.id]);
  }

  // const token = fastify.jwt.sign({
  //   id: user.id, email: userResponse.email,});
    const SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
   reply.setCookie('access_token', token, {
    httpOnly: true, 
    secure: false,   // true seulement en HTTPS
    sameSite: 'lax', // 'lax' ou 'none' si tu passes en HTTPS
    path: '/',
    maxAge: 60 * 60 // 1h
  })
  .redirect('http://localhost:5173/Profil');

});

//6 - remote auth with 42 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.get ('/api/auth/42', async (request , reply) => {
  const url = 'https://api.intra.42.fr/oauth/authorize?' + 
  new URLSearchParams ({
    client_id : process.env.FORTYTWO_CLIENT_ID,
    redirect_uri : process.env.FORTYTWO_REDIRECT_URI,
    response_type: 'code',
    scope: 'public',
  })
  reply.redirect(url);
});

fastify.get('/api/auth/42/callback' , async(request , reply) => {
const  code  = request.query.code;
if (!code) {
  return reply.code(400).send({error: 'No authorization code'});
}
  console.log('Authorization code:####', code);
  const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: process.env.FORTYTWO_CLIENT_ID,
      client_secret: process.env.FORTYTWO_CLIENT_SECRET,
      code,
      redirect_uri: process.env.FORTYTWO_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log('tokenData:', tokenData);

  const userResponse = await fetch('https://api.intra.42.fr/v2/me',
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}`},
    }
  );
  console.error('data lijaya men 42 ^^^^^^^^^^^^', userResponse);
  const user42 = await userResponse.json();

 let user = await dbGet('SELECT * FROM users WHERE provider = ? AND provider_id = ?',
  ['42', user42.id]
);

  if (!user) {

await dbRun(
  `INSERT INTO users (
     provider, provider_id, username, email, avatar_url, firstname, lastname, password_hash
   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    '42',
    user42.id,
    user42.login ||'user' + Date.now(),
    user42.email,
    user42.image.link || 'default-avatar.png',
    user42.first_name || '',
    user42.last_name || '',
    'OAUTH_USER'
  ]
);

  user = await dbGet('SELECT * FROM users WHERE provider = ? AND provider_id = ?',
  ['42', user42.id]);
  }

  // const token = fastify.jwt.sign({
  //   id: user.id, username: userResponse.login, email: userResponse.gmail});
    const SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    reply.setCookie('access_token', token, {
    httpOnly: true, 
    secure: false,   // true seulement en HTTPS
    sameSite: 'lax', // 'lax' ou 'none' si tu passes en HTTPS
  })
  .redirect('http://localhost:5173/Profil');

});


// 7 - users >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.get('/api/users', async (request, reply) => {
  try {
    const users = await dbAll(`
      SELECT id, username, email, created_at 
      FROM users 
      LIMIT 50
    `);
    
    return { users };
  } catch (error) {
    console.error('Get users error:', error);
    return reply.code(500).send({ error: 'Database error' });
  }
});
// 8 profile of each user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
fastify.get('/api/me', async (request, reply) => {
  const token = request.cookies.access_token; // doit correspondre
  if (!token) return reply.code(401).send({ authenticated: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await dbGet(
      `SELECT id, firstname, lastname, username, email FROM users WHERE id = ?`,
      [payload.id]
    );
    return reply.send({ authenticated: true, user });
  } catch (err) {
    return reply.code(401).send({ authenticated: false });
  }
});
// 9 - root >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.get('/', async (request, reply) => {
  return {
    app: 'Backend',
    version: '1.0',
    endpoints: {
      signup: 'POST /api/signup',
      login: 'POST /api/login',
      users: 'GET /api/users'
    }
  };
});

fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// 10- 2FA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//step 1
fastify.post('/api/2fa/enable', async (request, reply) => {
  const method = request.body.method;

  const userId = request.user?.id;
  if (!userId)
    return reply.code(401).send({ error: 'User not authenticated' });

  if (!['email', 'authenticator app'].includes(method))
    return reply.code(400).send({ error: 'Invalid 2FA method' });

  if (method === 'email') {
    await dbRun(
      `UPDATE users SET twofa_enabled = 1, twofa_method = 'email' WHERE id = ?`,
      [userId]);
    return reply.send({ success: true });
  }

  if (method === 'authenticator app') {
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log('secret:', secret);

    await dbRun(
      `UPDATE users SET twofa_enabled = 0, twofa_method = 'authenticator app', twofa_secret = ? WHERE id = ?`,
      [secret.base32, userId]);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    console.log('qrCode:', qrCode);

    return reply.send({ qrCode });
  }
});
