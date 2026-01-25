const jwt = require('jsonwebtoken');

module.exports = async function(fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS stats (
        user_id INTEGER NOT NULL,
        opponent_id INTEGER NOT NULL,
        wins INTEGER NOT NULL DEFAULT 0,
        loss INTEGER NOT NULL DEFAULT 0,
        total_matches NOT NULL DEFAULT 0,
        win_rate INTEGER NOT NULL DEFAULT 0
        )
    `).catch(err => {
    console.error('Error creating stats table:', err);
  })

  fastify.post('/api/stats/game_results', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.id;
        const {winner} = request.body;
        if(winner === userId){
            await dbRun(
                'UPDATE stats SET wins = wins + 1, total_matches = total_matches + 1 WHERE user_id = ?',
                [userId]
            );
        }
        else{
            await dbRun(
                'UPDATE stats SET loss = loss + 1, total_matches = total_matches + 1 WHERE user_id = ?',
                [userId]
            );
        }
        await dbRun(`
            UPDATE stats 
            SET win_rate = (wins * 100) / total_matches
            WHERE user_id = ?
        `, [userId]);

        return reply.send({
        success: true,
        message: 'stats added'
      });
    }
    catch(err){
      console.error('Add stat error:', err);
        return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
  })



  fastify.get('/api/stats', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
        return reply.code(401).send({ error: 'Please login first' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });//hadi t expirat mnin dert bzaf dyal requests dakchi 3lach zedt dik ignoreExpiration
        const userId = payload.id;
        const stats = await dbGet(
        'SELECT * FROM stats WHERE user_id = ?',
        [userId]
    );

    
    return reply.send(stats);
    }
    catch(err){
      console.error('get stat error:', err);
        return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
});
};