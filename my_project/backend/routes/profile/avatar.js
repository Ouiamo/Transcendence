const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbRun } = require('../../utils/dbHelpers');
  const avatarFolder = path.join(__dirname, '../../avatars');
  
  if (!fs.existsSync(avatarFolder)) {
    fs.mkdirSync(avatarFolder, { recursive: true });
  }

  fastify.post('/api/avatar', { preHandler: fastify.authenticate }, async (request, reply) => {
    // const token = request.cookies.access_token;
    
    // if (!token) {
    //   return reply.code(401).send({ error: 'Please login first' });
    // }

    try {
      // const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = request.user.id;

      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: 'No file selected' });
      }

      if (!data.mimetype.startsWith('image/')) {
        return reply.code(400).send({ error: 'Only image files allowed' });
      }

      const extension = data.mimetype.split('/')[1] || 'jpg';
      const filename = `avatar_${userId}.${extension}`;
      const filepath = path.join(avatarFolder, filename);

      const buffer = await data.toBuffer();
      fs.writeFileSync(filepath, buffer);

      await dbRun(
        'UPDATE users SET avatar_url = ? WHERE id = ?',
        [filename, userId]
      );

      return reply.send({
        success: true,
        message: 'Avatar uploaded!',
        avatarUrl: `/api/avatar/file/${filename}`
      });

    } catch (err) {
      console.error('Avatar error:', err);
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });

  fastify.get('/api/avatar/file/:filename', async (request, reply) => {
    const filename = request.params.filename;
    const filepath = path.join(avatarFolder, filename);

    if (fs.existsSync(filepath)) {
      try {
        const extension = filename.split('.').pop().toLowerCase();
        let contentType = 'image/jpeg';
        if (extension === 'png') contentType = 'image/png';
        else if (extension === 'gif') contentType = 'image/gif';
        else if (extension === 'webp') contentType = 'image/webp';
        
        const imageBuffer = fs.readFileSync(filepath);
        reply.header('Content-Type', contentType);
        reply.send(imageBuffer);
        
      } catch (err) {
        return reply.code(500).send({ error: 'Cannot read image' });
      }
    } else {
      return reply.code(404).send({ error: 'Avatar not found' });
    }
  });
};