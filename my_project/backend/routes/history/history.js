const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS history (
        user_id INTEGER NOT NULL,
        opp_username STRING NOT NULL,
        user_score INTEGER NOT NULL,
        opp_score INTEGER NOT NULL,
        opp_id INTEGER NOT NULL DEFAULT 0,
        match_type STRING NOT NULL,
        isWin BOOLEAN
        )
    `).catch(err => {
    console.error('Error creating history table:', err);
  })

  fastify.post('/api/history/new_score', { preHandler: fastify.authenticate }, async (request, reply) => {
   
    try{
        const userId = request.user.id;
        const {opponent_username, user_score, opp_score, opp_id, match_type} = request.body;
        let isWin = false;
        if (user_score > opp_score)
          isWin = true;
        await dbRun(
            'INSERT INTO history (user_id, opp_username, user_score, opp_score, opp_id, match_type, isWin) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, opponent_username, user_score, opp_score, opp_id, match_type, isWin]
          );
        return reply.send({
        success: true,
        message: `Added new game score`
      });
    }
    catch(err){
        console.error('Add score to history error:', err);
      return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
  });

   fastify.get('/api/history/get_history', { preHandler: fastify.authenticate }, async (request, reply) => {
      try {
        const userId = request.user.id;
        const history = await dbAll(
          'SELECT * FROM history WHERE user_id = ?',
          [userId]
        );

        const newHistory = await Promise.all(
          history.map(async (row) => {
            let opp_avatar = null;
            if (row.opp_id && row.opp_id !== 0) {
              const opponent = await dbGet(
                'SELECT avatar_url, provider FROM users WHERE id = ?',
                [row.opp_id]
              );
              if (opponent) {
                if (opponent.avatar_url) {
                  opp_avatar = opponent.provider === 'local'
                    ? `/api/avatar/file/${opponent.avatar_url}`
                    : opponent.avatar_url;
                } else {
                  opp_avatar = `/api/avatar/file/default-avatar.png`;
                }
              }
            }
            return { ...row, opp_avatar };
          })
        );

        return reply.send(newHistory);
      }
      catch(err){
        console.error('get history error:', err);
          return reply.code(500).send({ error: 'Server error: ' + err.message });
      }
  });

  fastify.get('/api/history/is_win', { preHandler: fastify.authenticate }, async (request, reply) => {
     
      try {
          const userId = request.user.id;
          const history = await dbAll(
          'SELECT isWin FROM history WHERE user_id = ?',
          [userId]
      );

      return reply.send(history);
      }
      catch(err){
        console.error('get history error:', err);
          return reply.code(500).send({ error: 'Server error: ' + err.message });
      }
  });
}