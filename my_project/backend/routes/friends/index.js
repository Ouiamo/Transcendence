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
// hadi fetchi 3liah fax tabghit tsifti invitation
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
      return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
  });
// hadi fetchi 3liha fax taccepti
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

// hadi fetchi 3liha bax tal3i lih notificxation bali flan sifat lih invitation
  fastify.get('/api/friends/requests', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const myId = payload.id;

      const incoming = await dbAll(`
        SELECT f.id as request_id, u.username, u.id as user_id
        FROM friends f
        JOIN users u ON u.id = f.user_id
        WHERE f.friend_id = ? AND f.status = 'pending'
      `, [myId]);

      const outgoing = await dbAll(`
        SELECT f.id as request_id, u.username, u.id as user_id
        FROM friends f
        JOIN users u ON u.id = f.friend_id
        WHERE f.user_id = ? AND f.status = 'pending'
      `, [myId]);

      return reply.send({
        success: true,
        incoming: incoming,
        outgoing: outgoing
      });

    } catch (err) {
      console.error('Get friend invitations error:', err);
      return reply.code(500).send({ error: 'Server error' });
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
      const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });//hadi t expirat mnin dert bzaf dyal requests dakchi 3lach zedt dik ignoreExpiration
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
          SELECT id, username, avatar_url, provider
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
          let avatarUrl = null;
          if (friend.avatar_url) {
            if (friend.provider === 'local') {
              avatarUrl = `https://localhost:3010/api/avatar/file/${friend.avatar_url}`;
            } else {
              avatarUrl = friend.avatar_url;
            }
          }
          myFriends.push({
            id: friend.id,
            username: friend.username,
            avatarUrl: avatarUrl,
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
