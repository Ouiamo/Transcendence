const jwt = require('jsonwebtoken');
const { dbGet } = require('../../utils/dbHelpers');
const path = require('path');
const fs = require('fs');


module.exports = async function (fastify) {

  fastify.get('/api/avatar/file/default-avatar.png', 
    async (request, reply) => {
  const filePath = path.join(__dirname,'../../avatar/file/default-avatar.png');

  if (!fs.existsSync(filePath)) {
    return reply.code(404).send({ error: 'File not found' });
  }

   reply.type('image/png');
  return reply.send(fs.createReadStream(filePath));
});

fastify.get('/api/profile', { preHandler: fastify.authenticate }, async (request, reply) => {
      const user = request.user; 
      let avatarUrl = `/api/avatar/file/default-avatar.png`;

      if (user.avatar_url) {
        if (user.provider === 'local') {
          avatarUrl = `/api/avatar/file/${user.avatar_url}`;
        } 
        else {
          avatarUrl = user.avatar_url;
        }
      }
    return reply.send({
      success: true,
      message: 'Profile fetched successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: avatarUrl,
        twofa_enabled: user.twofa_enabled,
        firstname : user.firstname,
        lastname : user.lastname,
      }
    });
});

};