// const jwt = require('jsonwebtoken');

// module.exports = async function(fastify, options) {
//   const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

//   await dbRun(`
//     CREATE TABLE IF NOT EXISTS friends (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER NOT NULL,
//       friend_id INTEGER NOT NULL,
//       status TEXT DEFAULT 'pending',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `).catch(err => {
//     console.error('Error creating friends table:', err);
//   });
// // hadi fetchi 3liah fax tabghit tsifti invitation
//   fastify.post('/api/friends/invitation', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//       return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = payload.id;
//       const { friendUsername } = request.body;

//       if (!friendUsername) {
//         return reply.code(400).send({ error: 'Friend username required' });
//       }

//       const friend = await dbGet(
//         'SELECT id FROM users WHERE username = ?',
//         [friendUsername]
//       );
      
//       if (!friend) {
//         return reply.code(404).send({ error: 'User not found' });
//       }

//       const friendId = friend.id;

//       if (userId === friendId) {
//         return reply.code(400).send({ error: 'Cannot add yourself' });
//       }

//       const existing = await dbGet(
//         `SELECT id FROM friends 
//          WHERE (user_id = ? AND friend_id = ?) 
//             OR (user_id = ? AND friend_id = ?)`,
//         [userId, friendId, friendId, userId]
//       );
      
//       if (existing) {
//         return reply.code(400).send({ error: 'Already friends or invitation pending' });
//       }


//       await dbRun(
//         'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
//         [userId, friendId, 'pending']
//       );

//       return reply.send({
//         success: true,
//         message: `Friend invitation sent to ${friendUsername}!`
//       });

//     } catch (err) {
//       console.error('Send invitation error:', err);
//       return reply.code(500).send({ error: 'Server error: ' + err.message });
//     }
//   });
// // hadi fetchi 3liha fax taccepti
//   fastify.post('/api/friends/accept', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//       return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = payload.id;
//       const { requestId } = request.body;

//       if (!requestId) {
//         return reply.code(400).send({ error: 'Request ID required' });
//       }

//       const requestData = await dbGet(
//         `SELECT * FROM friends 
//          WHERE id = ? AND friend_id = ? AND status = 'pending'`,
//         [requestId, userId]
//       );

//       if (!requestData) {
//         return reply.code(404).send({ error: 'Friend invitation not found' });
//       }


//       await dbRun(
//         'UPDATE friends SET status = ? WHERE id = ?',
//         ['accepted', requestId]
//       );

//       return reply.send({
//         success: true,
//         message: 'Friend invitation accepted!'
//       });

//     } catch (err) {
//       console.error('Accept friend error:', err);
//       return reply.code(500).send({ error: 'Server error' });
//     }
//   });

// // hadi fetchi 3liha bax tal3i lih notificxation bali flan sifat lih invitation
//   // fastify.get('/api/friends/requests', async (request, reply) => {
//   //   const token = request.cookies.access_token;
//   //   if (!token) {
//   //     return reply.code(401).send({ error: 'Please login first' });
//   //   }

//   //   try {
//   //     const payload = jwt.verify(token, process.env.JWT_SECRET);
//   //     const myId = payload.id;

//   //     const incoming = await dbAll(`
//   //       SELECT f.id as request_id, u.username, u.avatar_url, u.id as user_id
//   //       FROM friends f
//   //       JOIN users u ON u.id = f.user_id
//   //       WHERE f.friend_id = ? AND f.status = 'pending'
//   //     `, [myId]);
//   //     // const user = await dbGet(
//   //     //   'SELECT id FROM users WHERE id = ?',
//   //     //   []
//   //     // );
      
      

//   //     // const outgoing = await dbAll(`
//   //     //   SELECT f.id as request_id, u.username, u.id as user_id
//   //     //   FROM friends f
//   //     //   JOIN users u ON u.id = f.friend_id
//   //     //   WHERE f.user_id = ? AND f.status = 'pending'
//   //     // `, [myId]);

//   //     return reply.send({
//   //       success: true,
//   //       incoming: incoming,
//   //       // outgoing: outgoing
//   //     });

//   //   } catch (err) {
//   //     console.error('Get friend invitations error:', err);
//   //     return reply.code(500).send({ error: 'Server error' });
//   //   }
//   // });
//   fastify.get('/api/friends/requests', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//         return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//         const payload = jwt.verify(token, process.env.JWT_SECRET);
//         const myId = payload.id;

//         // 1. جلب البيانات مع avatar_url و provider
//         const incoming = await dbAll(`
//             SELECT 
//                 f.id as request_id, 
//                 u.username, 
//                 u.avatar_url, 
//                 u.provider,
//                 u.id as user_id
//             FROM friends f
//             JOIN users u ON u.id = f.user_id
//             WHERE f.friend_id = ? AND f.status = 'pending'
//         `, [myId]);

//         // 2. معالجة الـ Avatar URL لكل مستخدم (Mapping)
//         const formattedIncoming = incoming.map(user => {
//             let fullAvatarUrl = null;
//             if (user.avatar_url) {
//                 // إذا كان المستخدم محلي (Local) كنزيدو المسار ديال السيرفر
//                 if (user.provider === 'local') {
//                     fullAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/${user.avatar_url}`;
//                 } else {
//                     // إذا كان Google/42 كيكون URL واجد
//                     fullAvatarUrl = user.avatar_url;
//                 }
//             }
//             return {
//                 request_id: user.request_id,
//                 user_id: user.user_id,
//                 username: user.username,
//                 avatarUrl: fullAvatarUrl
//             };
//         });

//         return reply.send({
//             success: true,
//             incoming: formattedIncoming
//         });

//     } catch (err) {
//         console.error('Get friend invitations error:', err);
//         return reply.code(500).send({ error: 'Server error' });
//     }
// });

//   fastify.delete('/api/friends/remove', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//       return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = payload.id;
//       const { friendId } = request.body;

//       if (!friendId) {
//         return reply.code(400).send({ error: 'Friend ID required' });
//       }

//       await dbRun(
//         `DELETE FROM friends 
//          WHERE (user_id = ? AND friend_id = ?) 
//             OR (user_id = ? AND friend_id = ?)`,
//         [userId, friendId, friendId, userId]
//       );

//       return reply.send({
//         success: true,
//         message: 'Friend removed'
//       });

//     } catch (err) {
//       console.error('Remove friend error:', err);
//       return reply.code(500).send({ error: 'Server error' });
//     }
//   });

//   fastify.get('/api/friends', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//       return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });//hadi t expirat mnin dert bzaf dyal requests dakchi 3lach zedt dik ignoreExpiration
//       const myId = payload.id;

//       const friendships1 = await dbAll(`
//         SELECT friend_id 
//         FROM friends 
//         WHERE user_id = ? AND status = 'accepted'
//       `, [myId]);

//       const friendships2 = await dbAll(`
//         SELECT user_id 
//         FROM friends 
//         WHERE friend_id = ? AND status = 'accepted'
//       `, [myId]);

//       const allFriendIds = [];
//       for (const row of friendships1) {
//         allFriendIds.push(row.friend_id);
//       }
//       for (const row of friendships2) {
//         allFriendIds.push(row.user_id);
//       }
//       const myFriends = [];
      
//       for (const friendId of allFriendIds) {
//         const friend = await dbGet(`
//           SELECT id, username, avatar_url, provider
//           FROM users 
//           WHERE id = ?
//         `, [friendId]);
        
//         if (friend) {
//           let friendshipType = 'unknown';
//           const iAddedThem = friendships1.some(row => row.friend_id === friendId);
//           if (iAddedThem) {
//             friendshipType = 'You added them';
//           } else {
//             friendshipType = 'They added you';
//           }
//           let avatarUrl = null;
//           if (friend.avatar_url) {
//             if (friend.provider === 'local') {
//               avatarUrl = `https://10.13.249.23:3010/api/avatar/file/${friend.avatar_url}`;
//             } else {
//               avatarUrl = friend.avatar_url;
//             }
//           }
//           myFriends.push({
//             id: friend.id,
//             username: friend.username,
//             avatarUrl: avatarUrl,
//             friendshipType: friendshipType
//           });
//         }
//       }

//       return reply.send({
//         success: true,
//         friends: myFriends,
//         count: myFriends.length
//       });

//     } catch (err) {
//       console.error('Get friends error:', err);
//       return reply.code(500).send({ error: 'Server error' });
//     }
//   });

//   fastify.get('/api/friends/check_friendship/:username', async (request, reply) => {
//     const token = request.cookies.access_token;
//     if (!token) {
//       return reply.code(401).send({ error: 'Please login first' });
//     }

//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = payload.id;
//       const friendUsername = request.params.username;

//       const friend = await dbGet(
//         'SELECT id FROM users WHERE username = ?',
//         [friendUsername]
//       );
      
//       if (!friend) {
//         return reply.send({ areFriends: false, message: 'User not found' });
//       }

//       const friendId = friend.id;

//       const friendship = await dbGet(
//         `SELECT * FROM friends 
//          WHERE (user_id = ? AND friend_id = ?) 
//             OR (user_id = ? AND friend_id = ?)`,
//         [userId, friendId, friendId, userId]
//       );

//       return reply.send({
//         areFriends: !!friendship,
//         friendId: friendId
//       });

//     } catch (err) {
//       console.error('Check friends error:', err);
//       return reply.code(500).send({ error: 'Server error' });
//     }
//   });
//    fastify.get('/api/users/search/:query', async (request, reply) => {
//     const token = request.cookies.access_token;
//     let userId = null;

//     // محاولة جلب ID المستخدم الحالي إذا كان مسجلاً (بما أن الصداقة تتطلب login)
//     if (token) {
//         try {
//             const payload = jwt.verify(token, process.env.JWT_SECRET);
//             userId = payload.id;
//         } catch (err) { /* token invalid, proceed as guest */ }
//     }

//     try {
//         const { query } = request.params;

       
//         const users = await dbAll(`
//             SELECT 
//                 u.id, 
//                 u.avatar_url, 
//                 u.username,
//                 u.provider,
//                 (SELECT status FROM friends 
//                  WHERE (user_id = ? AND friend_id = u.id) 
//                     OR (user_id = u.id AND friend_id = ?)
//                 ) AS friendship_status
//             FROM users u
//             WHERE u.username LIKE ? AND u.id != ?
//             LIMIT 10
//         `, [userId, userId, `%${query}%`, userId]);

//         // تنظيف الداتا قبل الإرسال
//         const formattedUsers = users.map(user => {
//             let fullAvatarUrl = user.avatar_url;
//             if (user.avatar_url && user.provider === 'local') {
//                 fullAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/${user.avatar_url}`;
//             }

//             return {
//                 id: user.id,
//                 username: user.username,
//                 avatar_url: fullAvatarUrl,
//                 // إذا كان الـ status هو 'accepted' يعني أصدقاء
//                 is_friend: user.friendship_status === 'accepted',
//                 // إذا كان 'pending' يعني الطلب كاين ولكن مزال ماتقبلش
//                 is_pending: user.friendship_status === 'pending'
//             };
//         });

//         return { success: true, users: formattedUsers };
//     } catch (error) {
//         console.error('Search error:', error);
//         return reply.code(500).send({ error: 'Database error' });
//     }
// });
// };


const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  // Create friends table if not exists
  await dbRun(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, friend_id)
    )
  `).catch(err => {
    console.error('Error creating friends table:', err);
  });

  // Send friend invitation
  fastify.post('/api/friends/invitation', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      const { friendUsername } = request.body;

      if (!friendUsername) {
        return reply.code(400).send({ error: 'Friend username required' });
      }

      const friend = await dbGet(
        'SELECT id FROM users WHERE username = ?',
        [friendUsername]
      );
      
      if (!friend) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const friendId = friend.id;

      if (userId === friendId) {
        return reply.code(400).send({ error: 'Cannot add yourself' });
      }

      const existing = await dbGet(
        `SELECT id FROM friends 
         WHERE (user_id = ? AND friend_id = ?) 
            OR (user_id = ? AND friend_id = ?)`,
        [userId, friendId, friendId, userId]
      );
      
      if (existing) {
        return reply.code(400).send({ error: 'Already friends or invitation pending' });
      }

      await dbRun(
        'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
        [userId, friendId, 'pending']
      );

      return reply.send({
        success: true,
        message: `Friend invitation sent to ${friendUsername}!`
      });

    } catch (err) {
      console.error('Send invitation error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Accept friend request
  fastify.post('/api/friends/accept', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      const { requestId } = request.body;

      if (!requestId) {
        return reply.code(400).send({ error: 'Request ID required' });
      }

      const requestData = await dbGet(
        `SELECT * FROM friends 
         WHERE id = ? AND friend_id = ? AND status = 'pending'`,
        [requestId, userId]
      );

      if (!requestData) {
        return reply.code(404).send({ error: 'Friend invitation not found' });
      }

      await dbRun(
        'UPDATE friends SET status = ? WHERE id = ?',
        ['accepted', requestId]
      );

      return reply.send({
        success: true,
        message: 'Friend invitation accepted!'
      });

    } catch (err) {
      console.error('Accept friend error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Get friend requests
  fastify.get('/api/friends/requests', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const myId = payload.id;

      const incoming = await dbAll(`
          SELECT 
              f.id as request_id, 
              u.username, 
              u.avatar_url, 
              u.provider,
              u.id as user_id
          FROM friends f
          JOIN users u ON u.id = f.user_id
          WHERE f.friend_id = ? AND f.status = 'pending'
      `, [myId]);

      const formattedIncoming = incoming.map(user => {
        let fullAvatarUrl = null;
        if (user.avatar_url) {
          if (user.provider === 'local') {
            fullAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/${user.avatar_url}`;
          } else {
            fullAvatarUrl = user.avatar_url;
          }
        }
        return {
          request_id: user.request_id,
          user_id: user.user_id,
          username: user.username,
          avatarUrl: fullAvatarUrl || '/default-avatar.png'
        };
      });

      return reply.send({
        success: true,
        incoming: formattedIncoming
      });

    } catch (err) {
      console.error('Get friend invitations error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Remove friend
  fastify.delete('/api/friends/remove', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      const { friendId } = request.body;

      if (!friendId) {
        return reply.code(400).send({ error: 'Friend ID required' });
      }

      await dbRun(
        `DELETE FROM friends 
         WHERE (user_id = ? AND friend_id = ?) 
            OR (user_id = ? AND friend_id = ?)`,
        [userId, friendId, friendId, userId]
      );

      return reply.send({
        success: true,
        message: 'Friend removed'
      });

    } catch (err) {
      console.error('Remove friend error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Get friends list
  fastify.get('/api/friends', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const myId = payload.id;

      const friendships1 = await dbAll(`
        SELECT friend_id 
        FROM friends 
        WHERE user_id = ? AND status = 'accepted'
      `, [myId]);

      const friendships2 = await dbAll(`
        SELECT user_id 
        FROM friends 
        WHERE friend_id = ? AND status = 'accepted'
      `, [myId]);

      const allFriendIds = [
        ...friendships1.map(row => row.friend_id),
        ...friendships2.map(row => row.user_id)
      ];

      const myFriends = [];
      for (const friendId of allFriendIds) {
        const friend = await dbGet(`
          SELECT id, username, avatar_url, provider
          FROM users 
          WHERE id = ?
        `, [friendId]);
        
        if (friend) {
          let avatarUrl = null;
          if (friend.avatar_url) {
            if (friend.provider === 'local') {
              avatarUrl = `https://10.13.249.23:3010/api/avatar/file/${friend.avatar_url}`;
            } else {
              avatarUrl = friend.avatar_url;
            }
          }
          myFriends.push({
            id: friend.id,
            username: friend.username,
            avatarUrl: avatarUrl || '/default-avatar.png'
          });
        }
      }

      return reply.send({
        success: true,
        friends: myFriends,
        count: myFriends.length
      });

    } catch (err) {
      console.error('Get friends error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Search users - FIXED VERSION
  fastify.get('/api/users/search/:query', async (request, reply) => {
    console.log('🔍 Search endpoint called with query:', request.params.query);
    
    const token = request.cookies.access_token;
    let userId = null;

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.id;
            console.log('👤 User ID from token:', userId);
        } catch (err) {
            console.log('❌ Token verification failed:', err.message);
        }
    }

    try {
        const { query } = request.params;
        console.log('🔍 Searching for:', query);
        
        // Get all users matching search (excluding current user if logged in)
        let sql = `
            SELECT 
                u.id, 
                u.avatar_url, 
                u.username,
                u.provider
            FROM users u
            WHERE u.username LIKE ?
        `;
        
        const params = [`%${query}%`];
        
        if (userId) {
            sql += ` AND u.id != ?`;
            params.push(userId);
        }
        
        sql += ` ORDER BY u.username LIMIT 10`;
        
        console.log('📝 SQL:', sql);
        console.log('📝 Params:', params);
        
        const users = await dbAll(sql, params);
        console.log('✅ Found users:', users.length);
        
        // Check friendship status for each user
        const formattedUsers = [];
        for (const user of users) {
            let friendshipStatus = null;
            
            if (userId) {
                const friendship = await dbGet(
                    `SELECT status FROM friends 
                     WHERE (user_id = ? AND friend_id = ?) 
                        OR (user_id = ? AND friend_id = ?)`,
                    [userId, user.id, user.id, userId]
                );
                friendshipStatus = friendship ? friendship.status : null;
            }
            
            let fullAvatarUrl = user.avatar_url;
            if (user.avatar_url && user.provider === 'local') {
                fullAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/${user.avatar_url}`;
            }
            
            formattedUsers.push({
                id: user.id,
                username: user.username,
                avatar_url: fullAvatarUrl || '/default-avatar.png',
                is_friend: friendshipStatus === 'accepted',
                is_pending: friendshipStatus === 'pending'
            });
        }
        
        console.log('📤 Sending response:', { success: true, users: formattedUsers });
        return { success: true, users: formattedUsers };
        
    } catch (error) {
        console.error('❌ Search error:', error);
        return reply.code(500).send({ error: 'Database error: ' + error.message });
    }
  });
  
  // TEST ENDPOINT - Add this to debug
  fastify.get('/api/users/search-test/:query', async (request, reply) => {
    console.log('🧪 Test search for:', request.params.query);
    
    const allUsers = await dbAll(`
        SELECT id, username, avatar_url, provider 
        FROM users 
        LIMIT 20
    `);
    
    console.log('🧪 All users in database:', allUsers);
    
    return { 
        test: true, 
        totalUsers: allUsers.length,
        users: allUsers 
    };
  });
};