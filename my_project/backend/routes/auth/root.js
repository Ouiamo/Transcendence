const { dbAll } = require('../../utils/dbHelpers');

module.exports = async function(fastify){

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

// fastify.get('/', async (request, reply) => {
//   const apiKey = request.headers['x-api-key'];
//     if (!isValidApiKey(apiKey)) {
//       return reply.code(401).send({ error: 'Need API key' });
//     }
//   return {
//     app: 'Pong Transcendence',
//     version: '1.0',
//     status: 'online',
//     documentation: {
//       user_auth: '/api/signup, /api/login, /api/logout',
//       oauth: '/api/auth/google, /api/auth/42',
//       user_profile: '/api/profile, /api/me'
//     }
//   };
// });
};
