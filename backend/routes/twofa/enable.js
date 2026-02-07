
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
      console.log('Requested 2FA method:--------------->>>>>>', method);
      if (!['authenticator'].includes(method))
        return reply.code(400).send({ error: 'Invalid 2FA method' });

      const secret = speakeasy.generateSecret({ length: 20 });
      await dbRun(
        `UPDATE users SET twofa_method = 'authenticator', twofa_secret = ? WHERE id = ?`,
        [secret.base32, user.id]
      );

      const qrCode = await QRCode.toDataURL(secret.otpauth_url, {color: {
      dark: '#ff99ff', light: '#32174D' }});
      return reply.send({ qrCode, secret: secret.base32,
        twofa_enabled: false,
      });
    } 
    catch (err) 
    {
      console.error('2FA Enable Error:', err);
      return reply.code(500).send({ error: 'Internal server error', detail: err.message });
    }
  });


  fastify.post('/api/2fa/disable', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify({ onlyCookie: true });
      
      await dbRun(
        `UPDATE users SET twofa_enabled = 0, twofa_method = NULL, twofa_secret = NULL WHERE id = ?`,
        [decoded.id]
      );

      return reply.send({ success: true, message: '2FA disabled' });
    } 
    catch (err) 
    {
      console.error('2FA Disable Error:', err);
      return reply.code(500).send({ error: err.message });
    }
  });
};