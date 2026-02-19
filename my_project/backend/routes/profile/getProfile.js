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

fastify.get('/api/profile', async (request, reply) => {
  const token = request.cookies.access_token;
  if (!token)
    return reply.code(401).send({ error: 'Not authenticated' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await dbGet(
        'SELECT id, username, email, avatar_url, provider , firstname, lastname, twofa_enabled FROM users WHERE id = ?',
        [payload.id]
      );

      // Use relative paths so nginx (frontend container) proxies the request to the backend
      let avatarUrl = `/api/avatar/file/default-avatar.png`;

      if (user.avatar_url) {
        if (user.provider === 'local') {
          avatarUrl = `/api/avatar/file/${user.avatar_url}`;
        } 
        else {
          console.log("Callback in profile =====================");
          // keep external provider URLs as-is (they are already absolute)
          avatarUrl = user.avatar_url; // google / 42
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
  } catch(err) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
});



fastify.get('/api/me', async (request, reply) => {
  const token = request.cookies.access_token; 
  if (!token) return reply.code(401).send({ authenticated: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await dbGet(
      `SELECT id, firstname, lastname, avatar_url, username, email FROM users WHERE id = ?`,
      [payload.id]
    );
    return reply.send({ authenticated: true, user });
  } catch (err) {
    return reply.code(401).send({ authenticated: false });
  }
});
};