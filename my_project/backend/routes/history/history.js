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

  fastify.post('/api/history/new_score', async (request, reply) => {
    const token = request.cookies.access_token;
    if(!token){
        return reply.code(401).send({error: 'Please login first'});
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const userId = payload.id;
        const {opponent_username, user_score, opp_score, opp_id, match_type} = request.body;
        console.log("haaaaaaaaaaaadxi li wslni ::: ", opponent_username, user_score, opp_score, match_type);
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

   fastify.get('/api/history/get_history', async (request, reply) => {
      const token = request.cookies.access_token;
      if (!token) {
          return reply.code(401).send({ error: 'Please login first' });
      }
  
      try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          const userId = payload.id;
          const history = await dbAll(
          'SELECT * FROM history WHERE user_id = ?',
          [userId]
      );

      return reply.send(history);
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