
const { dbGet, dbRun } = require('../../utils/dbHelpers');
const speakeasy = require('speakeasy');

module.exports = async function (fastify) {
  fastify.post('/api/2fa/authenticator/verify', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify({ onlyCookie: true });
      const user = await dbGet('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (!user) 
        return reply.code(401).send({ error: 'User not found' });

      const { code } = request.body;
      if (!code) 
        return reply.code(400).send({ error: 'Code required' });
      
      const verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: code,
        window: 1
      });

    if (!verified) {
      console.log("❌ Invalid 2FA code")
      return reply.code(200).send({ success: false, message: 'Invalid 2FA code' });
    }
    console.log("✅ 2FA code is valid")
    if (!user.twofa_enabled) {
        await dbRun(
          `UPDATE users SET twofa_enabled = 1 WHERE id = ?`,
          [user.id]
        );
      }

      return reply.send({ success: true });
    } catch (err) {
      console.error('2FA Verify Error:', err);
      return reply.code(500).send({ error: 'Internal server error', detail: err.message });
    }
  });
};


