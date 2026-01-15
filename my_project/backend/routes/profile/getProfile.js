
const jwt = require('jsonwebtoken');
const { dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {
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
};