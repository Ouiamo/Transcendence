const speakeasy = require('speakeasy');
const { dbGet, dbRun } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {
  fastify.post('/api/2fa/authenticator/verify',
    
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      console.error("haniiiii666666666");
      const { code } = request.body;
      const userId = request.user?.id;
      if (!userId) 
          return reply.code(401).send({ error: "User not authenticated" });
        
      if (!code)
        return reply.code(400).send({ error: 'Code required' });
      console.error("hahowa code ##########", code);
      // 1️⃣ Get secret
      const user = await dbGet(
        `SELECT twofa_secret FROM users WHERE id = ?`,
        [userId]
      );

      if (!user || !user.twofa_secret)
        return reply.code(400).send({ error: '2FA not initialized' });

      // 2️⃣ Verify code
      const verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: code,
        window: 1
      });

      if (!verified)
        return reply.code(401).send({ error: 'Invalid code' });

      // 3️⃣ Enable 2FA
      try{
        await dbRun(
          `UPDATE users
           SET twofa_enabled = 1
           WHERE id = ?`,
          [userId]
        );
      }
      catch(err)
      {
        console.log("error f database", err);
      }
      return reply.send({ success: true });
    }
  );
};
