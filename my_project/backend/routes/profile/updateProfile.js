
// const { dbGet, dbRun } = require('../../utils/dbHelpers');

// module.exports = async function (fastify) {

// fastify.patch('/api/profile', async(request, reply) => {
//   const token = request.cookies.access_token;
  
//   if (!token) {
//     return reply.code(401).send({ error: 'Not authenticated' });
//   }
  
//   let payload;
//   try {
//     payload = jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return reply.code(401).send({ error: 'Invalid or expired token' });
//   }
  
//   try {
//     const { firstname, lastname, username, email } = request.body;
    
//     if (username || email) {
//       const existingUser = await dbGet(
//         `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
//         [email || '', username || '', payload.id]
//       );
//       if (existingUser) {
//         return reply.code(400).send({ error: 'Email or username already in use' });
//       }
//     }

//     const fields = [];
//     const values = [];
//     if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
//     if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
//     if (username) { fields.push('username = ?'); values.push(username); }
//     if (email) { fields.push('email = ?'); values.push(email); }

//     if (fields.length === 0) {
//       return reply.code(400).send({ error: 'No fields to update' });
//     }

//     values.push(payload.id);
//     await dbRun(
//       `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
//       values
//     );
    
//     const updatedUser = await dbGet(
//       `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
//       [payload.id]
//     );
    
//     let avatarUrl = null;
//     if (updatedUser.avatar_url && updatedUser.avatar_url !== 'default-avatar.png') {
//       avatarUrl = `/avatars/${updatedUser.avatar_url}`;
//     }

//     return reply.send({
//       success: true,
//       message: 'Profile updated successfully',
//       user: {
//         id: updatedUser.id,
//         firstname: updatedUser.firstname,
//         lastname: updatedUser.lastname,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         avatarUrl: avatarUrl
//       }
//     });
    
//   } catch (err) {
//     console.error(err);
//     return reply.code(500).send({ error: 'Server error' });
//   }
// });
// };


const { dbGet, dbRun } = require('../../utils/dbHelpers');
const jwt = require('jsonwebtoken'); // 1. ضروري تعرفي المكتبة في الأعلى (Header)

module.exports = async function (fastify) {

  fastify.patch('/api/profile', async (request, reply) => {
    // 2. جلب التوكن من الكوكيز
    const token = request.cookies.access_token;
    
    if (!token) {
      return reply.code(401).send({ error: 'Not authenticated' });
    }

    let payload;
    try {
      // 3. التحقق من التوكن باستخدام السيكريت الموجود في .env
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // إذا كان التوكن منتهي الصلاحية أو غير صالح
      console.error("JWT Verification Error:", err.message);
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    // 4. المنطق الخاص بتحديث البيانات (Business Logic)
    try {
      const { firstname, lastname, username, email } = request.body;

      // التأكد من عدم تكرار الـ Username أو Email
      if (username || email) {
        const existingUser = await dbGet(
          `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
          [email || '', username || '', payload.id]
        );
        if (existingUser) {
          return reply.code(400).send({ error: 'Email or username already in use' });
        }
      }

      // بناء الاستعلام (Query) بشكل ديناميكي (مثل الـ Vector في ++C)
      const fields = [];
      const values = [];
      if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
      if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
      if (username) { fields.push('username = ?'); values.push(username); }
      if (email) { fields.push('email = ?'); values.push(email); }

      if (fields.length === 0) {
        return reply.code(400).send({ error: 'No fields to update' });
      }

      // إضافة ID المستخدم في نهاية المصفوفة (Values array)
      values.push(payload.id);
      
      await dbRun(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      // جلب البيانات الجديدة بعد التحديث
      const updatedUser = await dbGet(
        `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
        [payload.id]
      );

      let avatarUrl = null;
      if (updatedUser.avatar_url && updatedUser.avatar_url !== 'default-avatar.png') {
        avatarUrl = `/avatars/${updatedUser.avatar_url}`;
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
          avatarUrl: avatarUrl
        }
      });

    } catch (err) {
      console.error("Database or Server Error:", err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
};