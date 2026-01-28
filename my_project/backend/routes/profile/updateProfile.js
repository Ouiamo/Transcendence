
const { dbGet, dbRun } = require('../../utils/dbHelpers');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
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
    const { firstname, lastname, username, email, avatar_url  } = request.body;
    
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
    // 2. معالجة الصورة (Base64) وحفظها كملف
    if (avatar_url && avatar_url.startsWith('data:image')) {
      // تحويل الـ Base64 إلى Buffer
      const base64Data = avatar_url.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      // إنشاء اسم فريد للملف (بواسطة الـ ID والتوقيت لضمان عدم التكرار)
      const fileName = `avatar-${payload.id}-${Date.now()}.png`;
      const uploadPath = path.join(__dirname, '../../avatar/file', fileName);
      
      // حفظ الملف في المجلد (Sync لتبسيط الكود، أو استخدمي Promises للأداء)
      fs.writeFileSync(uploadPath, buffer);
      // إضافة حقل الصورة للـ SQL Query
      fields.push('avatar_url = ?');
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
      finalAvatarUrl = `https://localhost:3010/api/avatar/file/${updatedUser.avatar_url}`;
    }
    console.log("updatedUser------>", updatedUser);
    console.log("finalAvatarUrl------>", finalAvatarUrl);
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



// const { dbGet, dbRun } = require('../../utils/dbHelpers');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');

// module.exports = async function (fastify) {
//   fastify.patch('/api/profile', async (request, reply) => {
//     const token = request.cookies.access_token;

//     if (!token) {
//       return reply.code(401).send({ error: 'Not authenticated' });
//     }

//     let payload;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return reply.code(401).send({ error: 'Invalid or expired token' });
//     }

//     try {
//       // 1. استخراج avatar_url من الـ body بجانب الحقول الأخرى
//       const { firstname, lastname, username, email, avatar_url } = request.body;

//       if (username || email) {
//         const existingUser = await dbGet(
//           `SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?`,
//           [email || '', username || '', payload.id]
//         );
//         if (existingUser) {
//           return reply.code(400).send({ error: 'Email or username already in use' });
//         }
//       }

      // const fields = [];
      // const values = [];

      // // تحديث الحقول النصية
      // if (firstname) { fields.push('firstname = ?'); values.push(firstname); }
      // if (lastname) { fields.push('lastname = ?'); values.push(lastname); }
      // if (username) { fields.push('username = ?'); values.push(username); }
      // if (email) { fields.push('email = ?'); values.push(email); }

      // 2. معالجة الصورة (Base64) وحفظها كملف
      // if (avatar_url && avatar_url.startsWith('data:image')) {
      //   // تحويل الـ Base64 إلى Buffer
      //   const base64Data = avatar_url.replace(/^data:image\/\w+;base64,/, "");
      //   const buffer = Buffer.from(base64Data, 'base64');

      //   // إنشاء اسم فريد للملف (بواسطة الـ ID والتوقيت لضمان عدم التكرار)
      //   const fileName = `avatar-${payload.id}-${Date.now()}.png`;
      //   const uploadPath = path.join(__dirname, '../../public/avatars', fileName);

      //   // حفظ الملف في المجلد (Sync لتبسيط الكود، أو استخدمي Promises للأداء)
      //   fs.writeFileSync(uploadPath, buffer);

      //   // إضافة حقل الصورة للـ SQL Query
      //   fields.push('avatar_url = ?');
      //   values.push(fileName);
      // }

      // if (fields.length === 0) {
      //   return reply.code(400).send({ error: 'No fields to update' });
      // }

      // values.push(payload.id);
      
      // // تنفيذ التحديث
      // await dbRun(
      //   `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      //   values
      // );

      // // 3. جلب البيانات المحدثة لإرسالها للـ Frontend
      // const updatedUser = await dbGet(
      //   `SELECT id, firstname, lastname, username, email, avatar_url FROM users WHERE id = ?`,
      //   [payload.id]
      // );

      // let finalAvatarUrl = null;
      // if (updatedUser.avatar_url) {
      //   // تأكدي أن هذا المسار هو نفسه المستخدم في الـ Static Files بـ Fastify
      //   finalAvatarUrl = `https://localhost:3010/api/avatar/file/${updatedUser.avatar_url}`;
      // }

//       return reply.send({
//         success: true,
//         message: 'Profile updated successfully',
//         user: {
//           id: updatedUser.id,
//           firstname: updatedUser.firstname,
//           lastname: updatedUser.lastname,
//           username: updatedUser.username,
//           email: updatedUser.email,
//           avatarUrl: finalAvatarUrl
//         }
//       });

//     } catch (err) {
//       console.error("Database or Server Error:", err);
//       return reply.code(500).send({ error: 'Server error' });
//     }
//   });
// };