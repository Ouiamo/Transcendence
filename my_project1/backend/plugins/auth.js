const { dbGet } = require('../utils/dbHelpers');

module.exports = async function (fastify) {
  fastify.decorate('authenticate', async function (request, reply) {
    console.log('🔥 authenticate preHandler called');

    try {
      console.log('Cookies available:', request.cookies);
      const decoded = await request.jwtVerify({ onlyCookie: true });
      console.log('✅ JWT DECODED:', decoded);

      const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (!user) {
        console.log('❌ User not found in DB');
        return reply.code(401).send({ error: 'User not found' });
      }

      request.user = user;
      console.log('✅ request.user set:', request.user);
    } catch (err) {
      console.error('❌ AUTH ERROR:', err); // log full error
      return reply.code(401).send({ error: 'Unauthorized', detail: err.message });
    }
  });
};

