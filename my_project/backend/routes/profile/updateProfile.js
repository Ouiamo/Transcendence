
const { dbGet, dbRun } = require('../../utils/dbHelpers');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const console = require('console');

 module.exports = async function (fastify) {

fastify.get('/api/avatar/file/:filename', async (request, reply) => {
  const { filename } = request.params;

  const filePath = path.join(__dirname, '../../avatar/file', filename);

  if (!fs.existsSync(filePath)) {
    return reply.code(404).send({ error: 'File not found' });
  }

  reply.type('image/png');
  return reply.send(fs.createReadStream(filePath));
});


 fastify.patch('/api/profile', { preHandler: fastify.authenticate }, async(request, reply) => {

  try {
    const { firstname, lastname, username, email, avatar_url , currentPassword, newPassword, confirmPassword} = request.body;

    if (username || email) {
      const existingUser = await dbGet(
        `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
        [email || '', username || '', request.user.id]
      );
      if (existingUser) {
        return reply.code(400).send({ error: 'Email or username already in use' });
      }
    }

    const fields = [];
    const values = [];
    if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
    if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
    if (username) { fields.push('username = ?'); values.push(username); }
    if (email) { fields.push('email = ?'); values.push(email); }

    if (currentPassword || newPassword || confirmPassword) 
    {
      if(!currentPassword || !newPassword || !confirmPassword) {
        return reply.code(400).send({ error: 'All password fields are required' });
      }
      const user = await dbGet(`SELECT password_hash FROM users WHERE id = ?`, [request.user.id]);
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return reply.code(400).send({ error: 'Current password is incorrect' });
      }
      if(newPassword !== confirmPassword) {
        return reply.code(400).send({ error: 'New password and confirm password do not match' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      fields.push('password_hash = ?'); 
      values.push(hashedPassword);
    }

    if (avatar_url && avatar_url.startsWith('data:image')) {
     
      const base64Data = avatar_url.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
     
      let fileName = `avatar-${request.user.id}-${Date.now()}.png`;
      const uploadPath = path.join(__dirname, '../../avatar/file', fileName);
    
      fs.writeFileSync(uploadPath, buffer);
      const user = await dbGet(`SELECT provider FROM users WHERE id = ?`, [request.user.id]);
      fields.push('avatar_url = ?');
      if(user.provider !== 'local') {
         fileName = `/api/avatar/file/${fileName}`;
        values.push(fileName);
      }
      else 
        values.push(fileName);
    }

    if (fields.length === 0) {
      return reply.code(400).send({ error: 'No fields to update' });
    }

    values.push(request.user.id);
    await dbRun(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedUser = await dbGet(
      `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
      [request.user.id]
    );
     let finalAvatarUrl = null;
     if (updatedUser.avatar_url) {
      finalAvatarUrl = `${updatedUser.avatar_url}`;
    }
  
    return reply.send({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: finalAvatarUrl
      }
    });
    
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

};