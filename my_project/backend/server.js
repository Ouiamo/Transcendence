
const fs = require('fs');
const path = require('path');
const fastify = require('fastify')({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, './certs/.key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem')),
  }
});
//fastify.setTrustProxy(true);

require('dotenv').config();
//db
require('./db/db');

// Plugins
fastify.register(require('./plugins/auth'));

// Routes
fastify.register(require('./routes/auth/root'));
fastify.register(require('./routes/auth/signup'));
fastify.register(require('./routes/auth/login'));
fastify.register(require('./routes/auth/logout'));
fastify.register(require('./routes/auth/oauth/google'));
fastify.register(require('./routes/auth/oauth/fortytwo'));

fastify.register(require('./routes/profile/getProfile'));
fastify.register(require('./routes/profile/updateProfile'));
//fastify.register(require('./routes/profile/avatar'));

//fastify.register(require('./routes/friends/'));

fastify.register(require('./routes/twofa/enable'));
fastify.register(require('./routes/twofa/email'));
fastify.register(require('./routes/twofa/authenticator'));

const {dbAll, dbGet, dbRun} = require ('./utils/dbHelpers');



fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE']
});

fastify.register(require('@fastify/cookie'), {
    secret: process.env.COOKIE_SECRET
  });
  fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
});

//======================================>listen
fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
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
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS friends (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER NOT NULL,
//       friend_id INTEGER NOT NULL,
//       status TEXT DEFAULT 'pending',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `);
// });

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
