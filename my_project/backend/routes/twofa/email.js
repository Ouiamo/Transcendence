const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../../utils/mailer');
const { dbRun, dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {

//   // 📩 SEND EMAIL CODE
//   fastify.get('/api/2fa/email/send',
//     async (request, reply) => {
//       try{
//         console.error("decoded:----------->");
//         const decoded = await request.jwtVerify({ onlyCookie: true });
//         console.log("decoded:----------->", decoded);
//       const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
//         console.log("user:----------->", user);
//       if (!user) 
//         return reply.code(401).send({ error: 'User not found' });

//       // // 1️⃣ Get user email
//       const row = await dbGet(
//         'SELECT email FROM users WHERE id = ?',
//         [user.id]
//       );
//       if (!row || !row.twofa_email_code)
//         return reply.code(400).send({ error: '2FA not requested' });
//       if (Date.now() > row.twofa_email_expires)
//         return reply.code(401).send({ error: 'Code expired' });

//     const valid = await bcrypt.compare(code, row.twofa_email_code);

//       // 2️⃣ Generate 6-digit code
//       const code = crypto.randomInt(100000, 1000000).toString();

//       // 3️⃣ Hash code (SECURITY)
//       const hashedCode = await bcrypt.hash(code, 10);

//       // 4️⃣ Expiration (5 minutes)
//       const expires = Date.now() + 100 * 60 * 1000;// current time + 5 min,  to ms

//       // 5️⃣ Save in DB
//       await dbRun(
//         `UPDATE users 
//          SET twofa_email_code = ?, twofa_email_expires = ?
//          WHERE id = ?`,
//         [hashedCode, expires, user.id]
//       );
//        // 6️⃣ Send email
//         await transporter.sendMail({
//             to: user.email,
//             subject: 'Your 2FA Code',
//             text: `Your verification code is ${code}`
//           });
//         return reply.send({ sent: true });

//     }
//     catch(error)
//     {
//       console.error('2FA send Email Error:', error);
//       return reply.code(500).send({ error: 'Internal server error', detail: error.message });
//     }
//     }
//   );

//   // ✅ VERIFY EMAIL CODE
//   fastify.post('/api/2fa/email/verify',
//     async (request, reply) => {
//     try{
//        const decoded = await request.jwtVerify({ onlyCookie: true });
//       const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
//       if (!user) 
//         return reply.code(401).send({ error: 'User not found' });
//       const { code } = request.body;

//       if (!code)
//         return reply.code(400).send({ error: 'Code required' });

//       // 1️⃣ Get stored code
//       await dbGet(
//         `SELECT twofa_email_code, twofa_email_expires 
//          FROM users WHERE id = ?`,
//         [user.id]
//       );

//       if (!user || !user.twofa_email_code)
//         return reply.code(400).send({ error: '2FA not requested' });

//       // 2️⃣ Expiration check
//       if (Date.now() > user.twofa_email_expires)
//         return reply.code(401).send({ error: 'Code expired' });

//       // 3️⃣ Compare hash
//       const valid = await bcrypt.compare(code, user.twofa_email_code);

//       if (!valid)
//         return reply.code(401).send({ error: 'Invalid code' });

//       // 4️⃣ Enable 2FA
//       await dbRun(
//         `UPDATE users 
//          SET twofa_enabled = 1, twofa_method = 'email',
//              twofa_email_code = NULL,
//              twofa_email_expires = NULL
//          WHERE id = ?`,
//         [user.id]
//       );
//       return reply.send({ success: true });
//     }
//     catch(error)
//     {
//       console.error('2FA Email verify Error:', error);
//       return reply.code(500).send({ error: 'Internal server error', detail: error.message });
//     }
//     }
//   );

//   // ✅ MAKE TOKEN OF AUTHENTICATION
//   fastify.post('/api/2fa/complete', async (request, reply) => {
//       const token = jwt.sign(
//         {id: user.id, username: user.username},
//         process.env.JWT_SECRET,
//         {expiresIn: '1h'}
//       );
//       reply.setCookie('access_token', token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'none',
//         path: '/',
//         maxAge: 60 * 60
//       });
//       return reply.send({
//         success: true,
//         message: 'Login successful',
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email
//         }
//       });
//   });

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const transporter = require('../../utils/mailer');
const { dbRun, dbGet } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {

  // 📩 SEND EMAIL CODE
  fastify.get('/api/2fa/email/send', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify({ onlyCookie: true });

      const user = await dbGet(
        'SELECT id, email FROM users WHERE id = ?',
        [decoded.id]
      );

      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }

      // generate 6-digit code
      const code = crypto.randomInt(100000, 1000000).toString();
      const hashedCode = await bcrypt.hash(code, 10);
      const expires = Date.now() + 5 * 60 * 1000;

      await dbRun(
        `UPDATE users
         SET twofa_email_code = ?, twofa_email_expires = ?
         WHERE id = ?`,
        [hashedCode, expires, user.id]
      );

      await transporter.sendMail({
        from: `"Ping Pong 🏓" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: 'Your 2FA Code',
        text: `Your verification code is: ${code}`
      });

      return reply.send({ sent: true });
    } catch (err) {
      console.error('2FA send Email Error:', err);
      return reply.code(500).send({ error: err.message });
    }
  });

  // ✅ VERIFY EMAIL CODE
  fastify.post('/api/2fa/email/verify', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify({ onlyCookie: true });
      const { code } = request.body;

      if (!code) {
        return reply.code(400).send({ error: 'Code required' });
      }

      const row = await dbGet(
        `SELECT twofa_email_code, twofa_email_expires
         FROM users WHERE id = ?`,
        [decoded.id]
      );

      if (!row || !row.twofa_email_code) {
        return reply.code(400).send({ error: '2FA not requested' });
      }

      if (Date.now() > row.twofa_email_expires) {
        return reply.code(401).send({ error: 'Code expired' });
      }

      const valid = await bcrypt.compare(code, row.twofa_email_code);
      if (!valid) {
        return reply.code(401).send({ error: 'Invalid code' });
      }

      await dbRun(
        `UPDATE users
         SET twofa_email_code = NULL,
             twofa_email_expires = NULL
         WHERE id = ?`,
        [decoded.id]
      );

      return reply.send({ success: true });
    } catch (err) {
      console.error('2FA Email verify Error:', err);
      return reply.code(500).send({ error: err.message });
    }
  });
};
 };
