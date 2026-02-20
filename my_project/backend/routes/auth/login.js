
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {
 fastify.post('/api/login', async (request, reply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.code(400).send({ error: 'Email and password required' });
  }

  try {
      const user = await dbGet('SELECT * FROM users WHERE email = ?',[email]);

  if (!user)
    return reply.code(401).send({ error: 'Invalid credentials' });

  if (user.provider !== 'local')
    return reply.code(401).send({ error: 'This account uses ' + user.provider + ' login. Please sign in with ' + user.provider + '.' });

  if (!(await bcrypt.compare(password, user.password_hash)))
    return reply.code(401).send({ error: 'Invalid credentials' });

  if (user.twofa_enabled) {
  const token = jwt.sign(
    { id: user.id, twofa: true },
    process.env.JWT_SECRET,
    { expiresIn: '10h' }
  );

  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 10
  });

  return reply.send({
    twofa_required: true,
    method: user.twofa_method,
    twofa_enabled: user.twofa_enabled
  });
}
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );
    
    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 10
    });

    return reply.send({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      twofa_enabled: user.twofa_enabled
    });

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: 'Server error' });
  }
});
};
