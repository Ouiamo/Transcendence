const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(err => {
    console.error('Error creating friends table:', err);
  });

  fastify.post('/api/friends/add', async (request, reply) => {
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
        return reply.code(400).send({ error: 'Already friends' });
      }

      await dbRun(
        'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
        [userId, friendId, 'accepted']
      );

      return reply.send({
        success: true,
        message: `Added ${friendUsername} as friend!`
      });

    } catch (err) {
      console.error('Add friend error:', err);
      return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
  });

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

      const allFriendIds = [];
      for (const row of friendships1) {
        allFriendIds.push(row.friend_id);
      }
      for (const row of friendships2) {
        allFriendIds.push(row.user_id);
      }
      const myFriends = [];
      
      for (const friendId of allFriendIds) {
        const friend = await dbGet(`
          SELECT id, username, avatar_url 
          FROM users 
          WHERE id = ?
        `, [friendId]);
        
        if (friend) {
          let friendshipType = 'unknown';
          const iAddedThem = friendships1.some(row => row.friend_id === friendId);
          if (iAddedThem) {
            friendshipType = 'You added them';
          } else {
            friendshipType = 'They added you';
          }
          myFriends.push({
            id: friend.id,
            username: friend.username,
            avatarUrl: friend.avatar_url ? `/api/avatar/file/${friend.avatar_url}` : '/api/avatar/file/default-avatar.png',
            friendshipType: friendshipType
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

  fastify.get('/api/friends/check_friendship/:username', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      const friendUsername = request.params.username;

      const friend = await dbGet(
        'SELECT id FROM users WHERE username = ?',
        [friendUsername]
      );
      
      if (!friend) {
        return reply.send({ areFriends: false, message: 'User not found' });
      }

      const friendId = friend.id;

      const friendship = await dbGet(
        `SELECT * FROM friends 
         WHERE (user_id = ? AND friend_id = ?) 
            OR (user_id = ? AND friend_id = ?)`,
        [userId, friendId, friendId, userId]
      );

      return reply.send({
        areFriends: !!friendship,
        friendId: friendId
      });

    } catch (err) {
      console.error('Check friends error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
};