const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS history (
        user_id INTEGER NOT NULL,
        opp_username STRING NOT NULL,
        user_score INTEGER NOT NULL,
        opp_score INTEGER NOT NULL,
        match_type STRING NOT NULL,
        isWin BOOLEAN
        )
    `).catch(err => {
    console.error('Error creating history table:', err);
  })

  const tableInfo = await dbAll("PRAGMA table_info(history)");
  const hasOppavatarColumn = tableInfo.some(col => col.name === 'opp_id');
  
  if (!hasOppavatarColumn) {
    await dbRun(`ALTER TABLE history ADD COLUMN opp_id INTEGER NOT NULL DEFAULT -1`)
      .then(() => {
        console.log('opp_id column added to history table');
      })
      .catch(err => {
        console.error('Error adding opp_id column:', err);
      });
  }

  fastify.post('/api/history/new_score', async (request, reply) => {
    const token = request.cookies.access_token;
    if(!token){
        return reply.code(401).send({error: 'Please login first'});
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const userId = payload.id;
        const {opponent_username, user_score, opp_score,opp_id, match_type} = request.body;
        console.log("haaaaaaaaaaaadxi li wslni ::: ", opponent_username, user_score, opp_score, match_type);
        let isWin = false;
        if (user_score > opp_score)
          isWin = true;
        await dbRun(
            'INSERT INTO history (user_id, opp_username, user_score, opp_score, match_type, isWin, opp_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, opponent_username, user_score, opp_score, match_type, isWin, opp_id]
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

   fastify.get('/api/history/get_history', async (request, reply) => {
      const token = request.cookies.access_token;
      if (!token) {
          return reply.code(401).send({ error: 'Please login first' });
      }
  
      try {
          const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
          const userId = payload.id;
          const history = await dbAll(
          'SELECT * FROM history WHERE user_id = ?',
          [userId]
      );

      const historyWithAvatars = await Promise.all(
        history.map(async (match) => {
          let oppAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/default-avatar.png`;
          
          if (match.opp_id && match.opp_id !== -1) {
            const opponent = await dbGet(
              'SELECT avatar_url, provider FROM users WHERE id = ?',
              [match.opp_id]
            );
            
            if (opponent && opponent.avatar_url) {
              if (opponent.provider === 'local') {
                oppAvatarUrl = `https://10.13.249.23:3010/api/avatar/file/${opponent.avatar_url}`;
              } else {
                oppAvatarUrl = opponent.avatar_url;
              }
            }
          }
          
          return {
            ...match,
            opp_avatar: oppAvatarUrl
          };
        })
      );

      return reply.send(historyWithAvatars);
      }
      catch(err){
        console.error('get history error:', err);
          return reply.code(500).send({ error: 'Server error: ' + err.message });
      }
  });

  fastify.get('/api/history/is_win', async (request, reply) => {
      const token = request.cookies.access_token;
      if (!token) {
          return reply.code(401).send({ error: 'Please login first' });
      }
  
      try {
          const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
          const userId = payload.id;
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