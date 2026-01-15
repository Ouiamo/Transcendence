
const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pong.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const { error } = require('console');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

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

  if(user.twofa_enabled)
  {
    return reply.send({
      requires2FA: true,
      method: user.twofa_method
    });
  }
    //jwt dial authentication
    const SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
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

// 3 - profile >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

fastify.get('/api/profile', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token)
    return reply.code(401).send({ error: 'Not authenticated' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await dbGet(
      'SELECT id, username, email, avatar_url FROM users WHERE id = ?',
      [payload.id]
    );
    
    let avatarUrl = null;
    if (user.avatar_url && user.avatar_url !== 'default-avatar.png') {
      avatarUrl = `/api/avatar/file/${user.avatar_url}`;
    }
    
    return reply.send({
      success: true,
      message: 'Profile fetched successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: avatarUrl
      }
    });
  } catch(err) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
});


// 4 - update profile >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

fastify.patch('/api/profile', async(request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Not authenticated' });
  }
  
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
  
  try {
    const { firstname, lastname, username, email } = request.body;
    
    if (username || email) {
      const existingUser = await dbGet(
        `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
        [email || '', username || '', payload.id]
      );
      if (existingUser) {
        return reply.code(400).send({ error: 'Email or username already in use' });
      }
    }

    const fields = [];
    const values = [];
    if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
    if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
    if (username) { fields.push('username = ?'); values.push(username); }
    if (email) { fields.push('email = ?'); values.push(email); }

    if (fields.length === 0) {
      return reply.code(400).send({ error: 'No fields to update' });
    }

    values.push(payload.id);
    await dbRun(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedUser = await dbGet(
      `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
      [payload.id]
    );
    
    let avatarUrl = null;
    if (updatedUser.avatar_url && updatedUser.avatar_url !== 'default-avatar.png') {
      avatarUrl = `/avatars/${updatedUser.avatar_url}`;
    }

    return reply.send({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: avatarUrl
      }
    });
    
  } catch (err) {
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
    app: 'Pong Transcendence',
    version: '1.0',
    status: 'online',
    documentation: {
      user_auth: '/api/signup, /api/login, /api/logout',
      oauth: '/api/auth/google, /api/auth/42',
      user_profile: '/api/profile, /api/me'
    }
  };
});


// rout pour logoutttttttttttttt
fastify.post('/api/logout', async (request, reply) => {
  reply
    .clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false // 
    })
    .send({ success: true, message: 'Logged out successfully' });
});

//======================================>avatar
fastify.register(require('fastify-multipart'));

const avatarFolder = path.join(__dirname, 'avatars');
if (!fs.existsSync(avatarFolder)) {
  fs.mkdirSync(avatarFolder, { recursive: true });
}


fastify.post('/api/avatar', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Please login first' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;

    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ error: 'No file selected' });
    }

    if (!data.mimetype.startsWith('image/')) {
      return reply.code(400).send({ error: 'Only image files allowed' });
    }

    const extension = data.mimetype.split('/')[1] || 'jpg';
    const filename = `avatar_${userId}.${extension}`;
    const filepath = path.join(avatarFolder, filename);

    const buffer = await data.toBuffer();
    fs.writeFileSync(filepath, buffer);

    await dbRun(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [filename, userId]
    );

    return reply.send({
      success: true,
      message: 'Avatar uploaded!',
      avatarUrl: `/api/avatar/file/${filename}`
    });

  } catch (err) {
    console.error('Avatar error:', err);
    return reply.code(500).send({ error: 'Upload failed' });
  }
});

fastify.get('/api/avatar/file/:filename', async (request, reply) => {
  const filename = request.params.filename;
  const filepath = path.join(avatarFolder, filename);
  
  if (fs.existsSync(filepath)) {
    const fileStream = fs.createReadStream(filepath);
    reply.type('image/jpeg').send(fileStream);
  } else {
    return reply.code(404).send({ error: 'Avatar not found' });
  }
});

//=========================================>friends
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

fastify.post('/api/friends/add', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Please login first' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;
    const { friendUsername } = request.body;

    if (!friendUsername) {
      return reply.code(400).send({ error: 'Friend username required' });
    }

    const friend = await dbGet(
      'SELECT id FROM users WHERE username = ?',
      [friendUsername]
    );
    
    if (!friend) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const friendId = friend.id;

    if (userId === friendId) {
      return reply.code(400).send({ error: 'Cannot add yourself' });
    }

    const existing = await dbGet(
      `SELECT id FROM friends 
       WHERE (user_id = ? AND friend_id = ?) 
          OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );
    
    if (existing) {
      return reply.code(400).send({ error: 'Already friends' });
    }

    await dbRun(
      'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
      [userId, friendId, 'accepted']
    );

    return reply.send({
      success: true,
      message: `Added ${friendUsername} as friend!`
    });

  } catch (err) {
    console.error('Add friend error:', err);
    return reply.code(500).send({ error: 'Server error: ' + err.message });
  }
});

fastify.delete('/api/friends/remove', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Please login first' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;
    const { friendId } = request.body;

    if (!friendId) {
      return reply.code(400).send({ error: 'Friend ID required' });
    }

    await dbRun(
      `DELETE FROM friends 
       WHERE (user_id = ? AND friend_id = ?) 
          OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    return reply.send({
      success: true,
      message: 'Friend removed'
    });

  } catch (err) {
    console.error('Remove friend error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

fastify.get('/api/friends', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Please login first' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;

    const friends = await dbAll(`
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        CASE 
          WHEN f.user_id = ? THEN 'You added them'
          ELSE 'They added you'
        END as friendship_type
      FROM friends f
      JOIN users u ON (
        (f.user_id = ? AND u.id = f.friend_id) 
        OR 
        (f.friend_id = ? AND u.id = f.user_id)
      )
      WHERE (f.user_id = ? OR f.friend_id = ?)
        AND u.id != ?
    `, [userId, userId, userId, userId, userId, userId]);

    const formattedFriends = friends.map(friend => ({
      id: friend.id,
      username: friend.username,
      avatarUrl: friend.avatar_url ? `/api/avatar/file/${friend.avatar_url}` : null,
      friendshipType: friend.friendship_type
    }));

    return reply.send({
      success: true,
      friends: formattedFriends,
      count: formattedFriends.length
    });

  } catch (err) {
    console.error('Get friends error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

fastify.get('/api/friends/check/:username', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token) {
    return reply.code(401).send({ error: 'Please login first' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id;
    const friendUsername = request.params.username;

    const friend = await dbGet(
      'SELECT id FROM users WHERE username = ?',
      [friendUsername]
    );
    
    if (!friend) {
      return reply.send({ areFriends: false, message: 'User not found' });
    }

    const friendId = friend.id;

    const friendship = await dbGet(
      `SELECT * FROM friends 
       WHERE (user_id = ? AND friend_id = ?) 
          OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    return reply.send({
      areFriends: !!friendship,
      friendId: friendId
    });

  } catch (err) {
    console.error('Check friends error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

//=========================================public api

const validApiKeys = ['pong-api-key'];

function isValidApiKey(key) {
  return validApiKeys.includes(key);
}


const requestCounts = {};


function checkRateLimit(ip) {
  const now = Date.now();
  const minute = Math.floor(now / 60000); 
  const key = ip + ':' + minute; 
  

  requestCounts[key] = (requestCounts[key] || 0) + 1;
  

  if (requestCounts[key] > 100) {
    return false;
  }
  
  return true;
}

fastify.get('/api/public/stats', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!isValidApiKey(apiKey)) {
    return reply.code(401).send({ error: 'Need API key' });
  }
  
  const ip = request.ip;
  if (!checkRateLimit(ip)) {
    return reply.code(429).send({
      error: 'Too many requests',
      message: 'Wait 1 minute'
    });
  }
  
  try {
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
    
    return reply.send({
      website: 'Pong Transcendence',
      users: userCount.count,
      time: new Date().toISOString()
    });
  } catch (error) {
    return reply.code(500).send({ error: 'Server error' });
  }
});

fastify.get('/api/public/users', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!isValidApiKey(apiKey)) {
    return reply.code(401).send({ error: 'Need API key' });
  }
  
  const ip = request.ip;
  if (!checkRateLimit(ip)) {
    return reply.code(429).send({ error: 'Too many requests' });
  }
  
  try {
    const users = await dbAll(`
      SELECT username, created_at 
      FROM users 
      LIMIT 10
    `);
    
    return reply.send({ users: users });
  } catch (error) {
    return reply.code(500).send({ error: 'Database error' });
  }
});


fastify.post('/api/public/contact', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!isValidApiKey(apiKey)) {
    return reply.code(401).send({ error: 'Need API key' });
  }
  
  const ip = request.ip;
  if (!checkRateLimit(ip)) {
    return reply.code(429).send({ error: 'Too many requests' });
  }
  
  const { name, message } = request.body;
  
  if (!name || !message) {
    return reply.code(400).send({ error: 'Name and message required' });
  }
  
  return reply.send({
    success: true,
    message: 'Contact received: ' + message
  });
});


fastify.put('/api/public/feedback', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!isValidApiKey(apiKey)) {
    return reply.code(401).send({ error: 'Need API key' });
  }
  
  const ip = request.ip;
  if (!checkRateLimit(ip)) {
    return reply.code(429).send({ error: 'Too many requests' });
  }
  
  const { rating } = request.body;
  
  if (!rating) {
    return reply.code(400).send({ error: 'Rating required' });
  }
  
  return reply.send({
    success: true,
    message: 'Thanks for rating: ' + rating + '/5'
  });
});


fastify.delete('/api/public/request', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!isValidApiKey(apiKey)) {
    return reply.code(401).send({ error: 'Need API key' });
  }
  
  const ip = request.ip;
  if (!checkRateLimit(ip)) {
    return reply.code(429).send({ error: 'Too many requests' });
  }
  
  const { request_id } = request.body;
  
  if (!request_id) {
    return reply.code(400).send({ error: 'Request ID required' });
  }
  
  return reply.send({
    success: true,
    message: 'Request ' + request_id + ' will be processed'
  });
});

//======================================>listen
fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
});


// 10- 2FA >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

  if (method === 'authenticator') {
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log('secret:', secret);

    await dbRun(
      `UPDATE users SET twofa_enabled = 0, twofa_method = 'authenticator', twofa_secret = ? WHERE id = ?`,
      [secret.base32, userId]);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    console.log('qrCode:', qrCode);

    return reply.send({ qrCode });
  }
});


fastify.post('/api/2fa/authenticator/verify', async (request, reply) => {
  const userId = request.user?.id;
  if (!userId)
    return reply.code(401).send({ error: 'User not authenticated' });

  const code = request.body.code;
  if (!code)
    return reply.code(400).send({ error: 'Code required' });

  const user = await dbGet(
    `SELECT twofa_secret FROM users WHERE id = ?`,
    [userId]
  );

  if (!user || !user.twofa_secret)
    return reply.code(400).send({ error: '2FA not initialized' });

  const verified = speakeasy.totp.verify({
    secret: user.twofa_secret,
    encoding: 'base32',
    token: code,
    window: 1
  });

  if (!verified)
    return reply.code(401).send({ error: 'Invalid code' });

  await dbRun(
    `UPDATE users SET twofa_enabled = 1 WHERE id = ?`,
    [userId]
  );

  return reply.send({ success: true });
});


fastify.post('/api/2fa/email/send', async (request, reply) => {

  const userId = request.user?.id;
  if(!userId)
    return reply.code(401).send({ error: 'User not authenticated' });

  const code = crypto.randomInt(100000, 1000000).toString();
  const expire = Date.now() + 5 * 60 * 1000; // current time + 5 min,  to ms

  await dbRun(
    `UPDATE users SET twofa_email_code = ?, twofa_email_expires WHERE id = ?`,
    [code, expire, userId]
  );
  
  console.log('code send to emailuser', code);
  try{
    await transporter.sendMail(
      {
        to: request.user.email,
        subject: 'Your 2FA Code',
        text: `Your verification code is ${code}`
      }
    );
    return reply.send({sent : true});
  }
  catch(err)
  {
    console.error('Email failed:', err);
    reply.code(500).send({error: 'Email not sent'});
  }
});

fastify.post('/api/2fa/email/verify', async (request, reply) => {
  const userId = request.user?.id;
  if (!userId)
    return reply.code(401).send({ error: 'User not authenticated'});

  const code = request.body.code;
  if (!code)
    return reply.code(400).send({ error: 'Code required' });

  const user = await dbGet(
    `SELECT twofa_email_code, twofa_email_expires FROM users WHERE id = ?`,
    [userId]
  );

  if (!user || user.twofa_email_code !== code)
    return reply.code(401).send({ error: 'Invalid code'});

  if (Date.now() > user.twofa_email_expires)
    return reply.code(401).send({ error: 'Code expired'});

  return reply.send({ success: true});
});


fastify.post('/api/2fa/complete', async (request, reply) => {

  const userId = request.user?.id;
  if(!userId)
      return reply.code(401).send({error: "User not authenticated"});
  
    const SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      {id: user.id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
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
});