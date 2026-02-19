// const { dbGet } = require('../utils/dbHelpers');
// const fp = require('fastify-plugin');

// // Public routes that do NOT require authentication
// const PUBLIC_ROUTES = [
//   '/api/login',
//   '/api/signup',
//   '/api/logout',
//   '/api/auth/google',
//   '/api/auth/google/callback',
//   '/api/auth/42',
//   '/api/auth/42/callback',
//   '/api/avatar/file/default-avatar.png',
//   '/',
//   // '/health',
// ];

// async function authPlugin(fastify) {
//   // Decorate so routes can still use { preHandler: fastify.authenticate } individually
//   fastify.decorate('authenticate', async function (request, reply) {
//     console.log('🔥 authenticate called');
//     try {
//       console.log('Cookies available:', request.cookies);
//       const decoded = await request.jwtVerify({ onlyCookie: true });
//       console.log('✅ JWT DECODED:', decoded);

//       const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
//       if (!user) {
//         console.log('❌ User not found in DB');
//         return reply.code(401).send({ error: 'User not found' });
//       }

//       request.user = user;
//       console.log('✅ request.user set:', request.user);
//     } catch (err) {
//       console.error('❌ AUTH ERROR:', err);
//       return reply.code(401).send({ error: 'Unauthorized', detail: err.message });
//     }
//   });

//   // Global preHandler — runs before EVERY route handler
//   fastify.addHook('preHandler', async function (request, reply) {
//     const url = request.routerPath || request.url;

//     // Skip authentication for public routes
//     if (PUBLIC_ROUTES.includes(url)) {
//       console.log(`⏩ Skipping auth for public route: ${url}`);
//       return;
//     }

//     console.log(`🔒 Global preHandler: authenticating ${url}`);
//     await fastify.authenticate(request, reply);
//   });
// }

// // fp() removes Fastify's encapsulation so the hook and decorator
// // are registered on the root instance and visible to ALL plugins/routes
// module.exports = fp(authPlugin);

