const { dbRun} = require('../../utils/dbHelpers');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = async function (fastify) {
fastify.post('/api/2fa/enable', 
  { preHandler: fastify.authenticate },
  async (request, reply) => {
  const mthd = request.body.mthd;

   const userId = request.user?.id;
  // if (!userId)
  //   return reply.code(401).send({ error: 'User not authenticated' });

  if (!['email', 'authenticator'].includes(mthd))
    return reply.code(400).send({ error: 'Invalid 2FA method' });

  if (mthd === 'email') {
    await dbRun(
      `UPDATE users SET twofa_enabled = 1, twofa_method = 'email' WHERE id = ?`,
      [userId]);
    return reply.send({ success: true });
  }

  if (mthd === 'authenticator') {
    const secret = speakeasy.generateSecret({ length: 20 });
    console.log('secret:', secret);
    try
    {
      await dbRun(
        `UPDATE users SET twofa_method = 'authenticator', twofa_secret = ? WHERE id = ?`,
        [secret.base32, userId]);
      }
      catch(err)
      {
        console.log("error f database", err);
      }
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    console.log("qrcode------------------>",qrCode);
    return reply.send({ qrCode });
  }
});
};