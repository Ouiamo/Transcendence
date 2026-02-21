const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

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

  //invitation
  fastify.post('/api/friends/invitation', { preHandler: fastify.authenticate }, async (request, reply) => {
    try {
       const userId = request.user.id;
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

  // Accept
  fastify.post('/api/friends/accept', { preHandler: fastify.authenticate }, async (request, reply) => {
   
    try {
       const userId = request.user.id;
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

  //requests
  fastify.get('/api/friends/requests', { preHandler: fastify.authenticate }, async (request, reply) => {

    try {
       const myId = request.user.id;

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
            fullAvatarUrl = `/api/avatar/file/${user.avatar_url}`;
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

  // Remove
  fastify.delete('/api/friends/remove', { preHandler: fastify.authenticate }, async (request, reply) => {

    try {
      const userId = request.user.id;
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

  //friends list
  fastify.get('/api/friends', { preHandler: fastify.authenticate }, async (request, reply) => {

    try {
      const myId = request.user.id;

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
              avatarUrl = `/api/avatar/file/${friend.avatar_url}`;
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

// Search
  fastify.get('/api/users/search/:query',  { preHandler: fastify.authenticate }, async (request, reply) => {
  
    let userId = request.user ? request.user.id : null;
    try {
        const { query } = request.params;
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
        
        const users = await dbAll(sql, params);
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
                fullAvatarUrl = `/api/avatar/file/${user.avatar_url}`;
            }
            
            formattedUsers.push({
                id: user.id,
                username: user.username,
                avatar_url: fullAvatarUrl || '/default-avatar.png',
                is_friend: friendshipStatus === 'accepted',
                is_pending: friendshipStatus === 'pending'
            });
        }
        return { success: true, users: formattedUsers };
        
    } catch (error) {
        console.error('❌ Search error:', error);
        return reply.code(500).send({ error: 'Database error: ' + error.message });
    }
  });
};