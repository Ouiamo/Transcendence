const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');


await dbRun(`
  CREATE TABLE IF NOT EXISTS game_invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => {
  console.error('Error creating game_invitations table:', err);
});

fastify.post('/api/game/invitation', { preHandler: fastify.authenticate }, async (request, reply) => {

  try {
    const senderId = request.user.id;
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

    const receiverId = friend.id;

    // Check if they are friends first
    const areFriends = await dbGet(
      `SELECT id FROM friends 
       WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
       AND status = 'accepted'`,
      [senderId, receiverId, receiverId, senderId]
    );
    
    if (!areFriends) {
      return reply.code(400).send({ error: 'You must be friends to send game invitation' });
    }

    // Check for existing pending invitation
    const existing = await dbGet(
      `SELECT id FROM game_invitations 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [senderId, receiverId]
    );
    
    if (existing) {
      return reply.code(400).send({ error: 'Game invitation already sent' });
    }

    await dbRun(
      'INSERT INTO game_invitations (sender_id, receiver_id, status) VALUES (?, ?, ?)',
      [senderId, receiverId, 'pending']
    );

    return reply.send({
      success: true,
      message: `Game invitation sent to ${friendUsername}!`
    });

  } catch (err) {
    console.error('Send game invitation error:', err);
    return reply.code(500).send({ error: 'Server error: ' + err.message });
  }
});

// Get game invitations
fastify.get('/api/game/invitations', { preHandler: fastify.authenticate }, async (request, reply) => {

  try {
    const myId = request.user.id;

    const invitations = await dbAll(`
      SELECT 
        g.id as invitation_id,
        u.id as sender_id,
        u.username as sender_username,
        u.avatar_url,
        u.provider,
        g.created_at
      FROM game_invitations g
      JOIN users u ON u.id = g.sender_id
      WHERE g.receiver_id = ? AND g.status = 'pending'
      ORDER BY g.created_at DESC
    `, [myId]);

    const formatted = invitations.map(inv => ({
      invitation_id: inv.invitation_id,
      sender_id: inv.sender_id,
      sender_username: inv.sender_username,
      avatarUrl: inv.provider === 'local' 
        // ? `https://localhost:3010/api/avatar/file/${inv.avatar_url}`
        ? `/api/avatar/file/${inv.avatar_url}`
        : inv.avatar_url,
      created_at: inv.created_at
    }));

    return reply.send({
      success: true,
      invitations: formatted
    });

  } catch (err) {
    console.error('Get game invitations error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

// Accept game invitation
fastify.post('/api/game/accept', { preHandler: fastify.authenticate }, async (request, reply) => {

  try {
    const userId = request.user.id;
    const { invitationId } = request.body;

    if (!invitationId) {
      return reply.code(400).send({ error: 'Invitation ID required' });
    }

    const invitation = await dbGet(
      `SELECT * FROM game_invitations 
       WHERE id = ? AND receiver_id = ? AND status = 'pending'`,
      [invitationId, userId]
    );

    if (!invitation) {
      return reply.code(404).send({ error: 'Game invitation not found' });
    }

    // Get both players' info
    const sender = await dbGet('SELECT username FROM users WHERE id = ?', [invitation.sender_id]);
    const receiver = await dbGet('SELECT username FROM users WHERE id = ?', [invitation.receiver_id]);

    await dbRun(
      'UPDATE game_invitations SET status = ? WHERE id = ?',
      ['accepted', invitationId]
    );

    
    const roomId = `game_${invitation.sender_id}_${invitation.receiver_id}_${Date.now()}`;


    const io = fastify.server.io || fastify.io;
    if (io) {
      const gameEventData = {
        roomId: roomId,
        player1: {
          id: invitation.sender_id,
          username: sender?.username
        },
        player2: {
          id: invitation.receiver_id,
          username: receiver?.username
        }
      };

     
      let emittedToPlayers = false;
      for (const [, sock] of io.sockets.sockets) {
        if (sock.userId === invitation.sender_id || sock.userId === invitation.receiver_id) {
          sock.emit('private_game_start', gameEventData);
          emittedToPlayers = true;
        }
      }
      
     
      if (!emittedToPlayers) {
        console.log(" Couldn't find player sockets, broadcasting to all");
        io.emit('private_game_start', gameEventData);
      }
    }

    return reply.send({
      success: true,
      message: 'Game invitation accepted!',
      sender_id: invitation.sender_id,
      roomId: roomId
    });

  } catch (err) {
    console.error('Accept game invitation error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});

fastify.delete('/api/game/invitation/:id', { preHandler: fastify.authenticate }, async (request, reply) => {

  try {
    const userId = request.user.id;
    const invitationId = request.params.id;

    await dbRun(
      `DELETE FROM game_invitations 
       WHERE id = ? AND receiver_id = ?`,
      [invitationId, userId]
    );

    return reply.send({
      success: true,
      message: 'Game invitation declined'
    });

  } catch (err) {
    console.error('Delete game invitation error:', err);
    return reply.code(500).send({ error: 'Server error' });
  }
});
};