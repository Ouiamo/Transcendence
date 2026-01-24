const jwt = require('jsonwebtoken');

module.exports = async function (fastify) {
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      request.user = await request.jwtVerify();
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

