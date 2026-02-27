
const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const { dbGet } = require('../utils/dbHelpers');

async function authPlugin(fastify) {
    
  fastify.decorate('authenticate', async function (request, reply) {
    const token = request.cookies.access_token;

    if (!token) {
      return reply.code(401).send({ error: 'Not authenticated' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await dbGet(
        'SELECT * FROM users WHERE id = ?',
        [decoded.id]
      );
      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }
      request.user = user;

    } catch (err) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }
  });
}

module.exports = fp(authPlugin);


