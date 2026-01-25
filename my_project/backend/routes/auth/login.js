
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

  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return reply.code(401).send({ error: 'Invalid credentials' });

  // if(user.twofa_enabled)
  // {
  //   console.log("hani %%%%%%%%%%%%%%%");
  //   return reply.send({
  //     requires2FA: true,
  //     method: user.twofa_method
  //   });
  // }
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
    path: '/'
  });

  return reply.send({
    requires2FA: true,
    method: user.twofa_method
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
      maxAge: 60 * 60
    });

    return reply.send({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: 'Server error' });
  }
});
};
