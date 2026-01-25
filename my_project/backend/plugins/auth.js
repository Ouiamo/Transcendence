const jwt = require('jsonwebtoken');

module.exports = async function (fastify) {
fastify.decorate('authenticate', async (request, reply) => {
  try {
    const decoded = await request.jwtVerify({
      onlyCookie: true
    });
    console.log('✅ JWT DECODED:', decoded);
    request.user = decoded;
  } catch (err) {
    console.error('❌ JWT VERIFY FAILED', err.message);
    return reply.code(401).send({ error: 'Unauthorized', reason: err.message });
  }
});
};

