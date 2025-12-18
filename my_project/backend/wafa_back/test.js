// const fastify = require('fastify')();

// fastify.get('/', async () => {
//     return{ message: 'hello fastify from wafaa :)'};
// });

// fastify.listen({port: 1998});


import Fastify from 'fastify';

const server = Fastify();
//console.log(server);
console.log(Object.keys(server));
//This will show all functions and properties of myserver object. 


server.get('/', async () => {
  return { message: 'hello server from wafaa :)' };
});

server.listen({ port: 1998 }, (err) => {
  if (err) throw err;
  console.log('Server running on http://localhost:1998');
});

server.get('/wafaa', async () => {
  return 'zahir';
});


server.post('/login', async (request) => {
  return request.body;
});


server.post('/register', async (request) => {
  const { username } = request.body;
  return { welcome: username };
});





// // routes/user.js
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { db } from '../db.js'; // your database connection

// const SECRET = 'YOUR_SECRET_KEY'; // secret for JWT

// export async function userRoutes(fastify) {

//   // REGISTER
//   fastify.post('/register', async (request, reply) => {
//     const { username, email, password } = request.body;

//     // 1. check if user exists
//     const existingUser = await db.get('SELECT * FROM users WHERE email = ?', email);
//     if (existingUser) {
//       return reply.code(400).send({ error: 'User already exists' });
//     }

//     // 2. hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 3. insert user into DB
//     await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
//       username, email, hashedPassword);

//     return { message: 'User registered successfully' };
//   });

//   // LOGIN
//   fastify.post('/login', async (request, reply) => {
//     const { email, password } = request.body;

//     const user = await db.get('SELECT * FROM users WHERE email = ?', email);
//     if (!user) {
//       return reply.code(400).send({ error: 'Invalid email or password' });
//     }

//     const passwordValid = await bcrypt.compare(password, user.password);
//     if (!passwordValid) {
//       return reply.code(400).send({ error: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

//     return { token };
//   });

//   // GET PROFILE (protected)
//   fastify.get('/profile', async (request, reply) => {
//     const authHeader = request.headers['authorization'];
//     if (!authHeader) return reply.code(401).send({ error: 'Unauthorized' });

//     const token = authHeader.split(' ')[1];
//     try {
//       const decoded = jwt.verify(token, SECRET);
//       const user = await db.get('SELECT id, username, email FROM users WHERE id = ?', decoded.id);
//       return { user };
//     } catch (err) {
//       return reply.code(401).send({ error: 'Invalid token' });
//     }
//   });

// }
