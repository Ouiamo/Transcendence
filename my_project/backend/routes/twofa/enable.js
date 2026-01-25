
const { dbRun, dbGet } = require('../../utils/dbHelpers');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = async function (fastify) {
  fastify.post('/api/2fa/enable', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify({ onlyCookie: true });
      const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (!user) 
        return reply.code(401).send({ error: 'User not found' });

      const method = request.body.mthd;
      if (!['email', 'authenticator'].includes(method))
        return reply.code(400).send({ error: 'Invalid 2FA method' });

      if (method === 'email') {
        await dbRun(
          `UPDATE users SET twofa_enabled = 1, twofa_method = 'email' WHERE id = ?`,
          [user.id]
        );
        return reply.send({ success: true });
      }

      const secret = speakeasy.generateSecret({ length: 20 });
      await dbRun(
        `UPDATE users SET twofa_method = 'authenticator', twofa_secret = ? WHERE id = ?`,
        [secret.base32, user.id]
      );

      const qrCode = await QRCode.toDataURL(secret.otpauth_url);
      return reply.send({ qrCode, secret: secret.base32 });
    } catch (err) {
      console.error('2FA Enable Error:', err);
      return reply.code(500).send({ error: 'Internal server error', detail: err.message });
    }
  });
};

