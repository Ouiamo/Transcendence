const { dbGet, dbRun } = require('../../utils/dbHelpers');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = async function (fastify) {

  fastify.delete('/api/profile', { preHandler: fastify.authenticate }, async (request, reply) => {

    try {
      const userId = request.user.id;
      const user = await dbGet('SELECT avatar_url, provider FROM users WHERE id = ?', [userId]);
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      if (user.avatar_url && user.provider === 'local' && !user.avatar_url.startsWith('http')) {
        const fileName = path.basename(user.avatar_url);
        const avatarPath = path.join(__dirname, '../../../avatar/file', fileName);
        
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
          console.log(`🗑️ Deleted avatar file: ${fileName}`);
        }
      }
      await dbRun('DELETE FROM friends WHERE user_id = ? OR friend_id = ?', [userId, userId]);
 
      await dbRun('DELETE FROM game_invitations WHERE sender_id = ? OR receiver_id = ?', [userId, userId]);
      
      await dbRun('DELETE FROM stats WHERE user_id = ?', [userId]);
      
      await dbRun('DELETE FROM history WHERE user_id = ?', [userId]);

      await dbRun('DELETE FROM users WHERE id = ?', [userId]);

      reply.clearCookie('access_token', {
        path: '/',
        secure: true,
        sameSite: 'none'
      });

      return reply.send({
        success: true,
        message: 'Account permanently deleted'
      });

    } catch (err) {
      console.error('Delete account error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

};