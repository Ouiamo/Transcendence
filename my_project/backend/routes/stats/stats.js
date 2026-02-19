const jwt = require('jsonwebtoken');

module.exports = async function (fastify, options) {
  const { dbAll, dbGet, dbRun } = require('../../utils/dbHelpers');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS stats (
        user_id INTEGER NOT NULL,
        opp_username STRING NOT NULL,
        opp_id INTEGER NOT NULL DEFAULT 0,
        wins INTEGER NOT NULL DEFAULT 0,
        loss INTEGER NOT NULL DEFAULT 0,
        total_matches INTEGER NOT NULL DEFAULT 0,
        win_rate INTEGER NOT NULL DEFAULT 0,
        points INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `).catch(err => {
    console.error('Error creating stats table:', err);
  })


  // const tableInfo = await dbAll("PRAGMA table_info(stats)");
  // const hasPointsColumn = tableInfo.some(col => col.name === 'points');

  // if (!hasPointsColumn) {
  //   await dbRun(`ALTER TABLE stats ADD COLUMN points INTEGER NOT NULL DEFAULT 0`)
  //     .then(() => {
  //       console.log('Points column added to stats table');
  //     })
  //     .catch(err => {
  //       console.error('Error adding points column:', err);
  //     });
  // }

  const statsCount = await dbGet('SELECT COUNT(*) as count FROM stats');

  if (statsCount.count === 0) {
    await dbRun(`
    INSERT INTO stats (user_id, opp_username, opp_id, wins, loss, win_rate, points, total_matches)
    SELECT id, "none", 0, 0, 0, 0, 0, 0
    FROM users
  `).then(() => {
      console.log('Stats table populated with existing users');
    }).catch(err => {
      console.error('Error populating stats table:', err);
    });
  }

  fastify.post('/api/stats/game_results', async (request, reply) => {
    const token = request.cookies.access_token;
    if (!token) {
      return reply.code(401).send({ error: 'Please login first' });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const userId = payload.id;
      const { winner, opponent_username } = request.body;
      console.log("usrIDddddd ", userId, " ooooooo ", winner);
      const user = await dbGet('SELECT username FROM users WHERE id = ?', [userId]);
      if (winner === user.username) {
        await dbRun(
          'UPDATE stats SET wins = wins + 1, total_matches = total_matches + 1, points = points + 30, opp_username = ? WHERE user_id = ?',
          [opponent_username, userId]
        );
      }
      else {
        await dbRun(
          'UPDATE stats SET loss = loss + 1, total_matches = total_matches + 1, points = points - 30, opp_username = ? WHERE user_id = ?',
          [opponent_username, userId]
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
    catch (err) {
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
    catch (err) {
      console.error('get stat error:', err);
      return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
  });



};