
const { dbGet, dbRun } = require('../../utils/dbHelpers');

module.exports = async function (fastify) {

  fastify.patch('/api/profile', async(request, reply) => {
    const token = request.cookies.access_token;
    if(!token) {
      return reply.code(401).send({error : 'Not authenticated'});
    }
    let payload;
    try{
      payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch {
      return reply.code(401).send({error : 'Invalid or expired token'});
    }
    try {

      const {firstname, lastname, username, email} =request.body;
      if (username || email) 
      {
        const existingUser = await dbGet(`
          SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
          [email || '', username || '', payload.id]);
          if(existingUser) 
          {
            return reply.code(400).send({error: 'Email or username already in use'});
          }
      }
    
      const fields = [];
      const values = [];
      if (firstname) {fields.push('firstname = ?'); values.push(firstname);}
      if (lastname) {fields.push('lastname = ?'); values.push(lastname);}
      if (username) {fields.push('username = ?'); values.push(username);}
      if (email) {fields.push('email = ?'); values.push(email);}
    
      if (fields.length === 0)
        return reply.code(400).send({ error: 'No fields to update' });
    
      values.push(payload.id);
      await dbRun(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,values
      );
      const updatedUser = await dbGet (
        `SELECT id, firstname, lastname, username, email FROM users WHERE id = ?`, [payload.id]
      );
    
      return reply.send({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    }
    catch (err) {
          console.error(err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
};
