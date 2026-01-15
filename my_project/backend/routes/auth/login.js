
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {
  fastify.post('/api/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = await dbGet(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return reply.code(401).send({ error: 'Invalid credentials' });

    if (user.twofa_enabled)
      return reply.send({ requires2FA: true, method: user.twofa_method });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    reply.setCookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600
    });

    return reply.send({ success: true });
  });
};
