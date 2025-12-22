
const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pong.db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ba9i khsni nzid l avatar elemet f database!!
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT,
      lastname TEXT,  
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT DEFAULT 'default-avatar.png',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

fastify.register(require('@fastify/cors'), {
  origin: true
});

fastify.register(require('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET
  });

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
      `INSERT INTO users (firstname, lastname, username, email, password_hash) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstname, lastname, username, email, hashedPassword]
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
    console.log("~~~~~~@token :");
    console.log(token);
    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
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
//hadi bach afficher profile 
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

// 5 - users >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

// 6 - root >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
