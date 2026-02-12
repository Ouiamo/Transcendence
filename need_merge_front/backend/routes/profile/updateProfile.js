
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


 fastify.patch('/api/profile', async(request, reply) => {
   const token = request.cookies.access_token;
  
  if (!token) {
    return reply.code(401).send({ error: 'Not authenticated' });
  }
  
   let payload;
    try{
      payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) 
    {
      console.error("JWT Verification Error:", err.message);
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }
  
  try {
    const { firstname, lastname, username, email, avatar_url , currentPassword, newPassword, confirmPassword} = request.body;

    if (username || email) {
      const existingUser = await dbGet(
        `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
        [email || '', username || '', payload.id]
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
      const user = await dbGet(`SELECT password_hash FROM users WHERE id = ?`, [payload.id]);
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
     
      let fileName = `avatar-${payload.id}-${Date.now()}.png`;
      const uploadPath = path.join(__dirname, '../../avatar/file', fileName);
    
      fs.writeFileSync(uploadPath, buffer);
      const user = await dbGet(`SELECT provider FROM users WHERE id = ?`, [payload.id]);
      fields.push('avatar_url = ?');
      if(user.provider !== 'local') {
        // return reply.code(400).send({ error: 'Avatar can only be updated for local accounts' });
         fileName = `https://localhost:3010/api/avatar/file/${fileName}`;
        values.push(fileName);
      }
      else 
        values.push(fileName);
    }

    console.log("fields------>", firstname, lastname, username, email, avatar_url);
    console.log("values------>", values);
    if (fields.length === 0) {
      return reply.code(400).send({ error: 'No fields to update' });
    }

    values.push(payload.id);
    await dbRun(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedUser = await dbGet(
      `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
      [payload.id]
    );
     let finalAvatarUrl = null;
     if (updatedUser.avatar_url) {
      finalAvatarUrl = `${updatedUser.avatar_url}`;
      //console.log("finalAvatarUrl------>", finalAvatarUrl);
    //   await dbRun(
    //    `UPDATE users SET avatar_url = ? WHERE id = ?`,
    //    [finalAvatarUrl, updatedUser.id]
    //  );
      //console.log("finalAvatarUrl11111111------>", updatedUser.avatar_url);

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