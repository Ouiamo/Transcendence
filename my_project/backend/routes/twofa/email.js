const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../../utils/mailer');
const { dbRun, dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {

  // 📩 SEND EMAIL CODE
  fastify.post('/api/2fa/email/send',
    { preHandler: fastify.authenticate },
    async (request, reply) => {

      const userId = request.user.id;

      // 1️⃣ Get user email
      const user = await dbGet(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );

      if (!user)
        return reply.code(404).send({ error: 'User not found' });

      // 2️⃣ Generate 6-digit code
      const code = crypto.randomInt(100000, 1000000).toString();

      // 3️⃣ Hash code (SECURITY)
      const hashedCode = await bcrypt.hash(code, 10);

      // 4️⃣ Expiration (5 minutes)
      const expires = Date.now() + 5 * 60 * 1000;// current time + 5 min,  to ms

      // 5️⃣ Save in DB
      await dbRun(
        `UPDATE users 
         SET twofa_email_code = ?, twofa_email_expires = ?
         WHERE id = ?`,
        [hashedCode, expires, userId]
      );

      // 6️⃣ Send email
      try{
          await transporter.sendMail({
            to: user.email,
            subject: 'Your 2FA Code',
            text: `Your verification code is ${code}`
          });
          return reply.send({ sent: true });
      }
      catch(err)
      {
        console.error('Email failed:', err);
        reply.code(500).send({error: 'Email not sent'});
      }
    }
  );

  // ✅ VERIFY EMAIL CODE
  fastify.post('/api/2fa/email/verify',
    { preHandler: fastify.authenticate },
    async (request, reply) => {

      const { code } = request.body;
      const userId = request.user.id;

      if (!code)
        return reply.code(400).send({ error: 'Code required' });

      // 1️⃣ Get stored code
      const user = await dbGet(
        `SELECT twofa_email_code, twofa_email_expires 
         FROM users WHERE id = ?`,
        [userId]
      );

      if (!user || !user.twofa_email_code)
        return reply.code(400).send({ error: '2FA not requested' });

      // 2️⃣ Expiration check
      if (Date.now() > user.twofa_email_expires)
        return reply.code(401).send({ error: 'Code expired' });

      // 3️⃣ Compare hash
      const valid = await bcrypt.compare(code, user.twofa_email_code);

      if (!valid)
        return reply.code(401).send({ error: 'Invalid code' });

      // 4️⃣ Enable 2FA
      await dbRun(
        `UPDATE users 
         SET twofa_enabled = 1, twofa_method = 'email',
             twofa_email_code = NULL,
             twofa_email_expires = NULL
         WHERE id = ?`,
        [userId]
      );
      return reply.send({ success: true });
    }
  );

  // ✅ MAKE TOKEN OF AUTHENTICATION
  fastify.post('/api/2fa/complete', async (request, reply) => {
      const token = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
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
  });
};
