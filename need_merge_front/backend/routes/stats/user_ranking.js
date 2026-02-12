module.exports = async function (fastify) {
const jwt = require('jsonwebtoken');

fastify.get('/api/stats/user_ranking', async (request, reply) => {
  const { dbAll } = require('../../utils/dbHelpers');

    const token = request.cookies.access_token;
    if (!token) {
        return reply.code(401).send({ error: 'Please login first' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const myId = payload.id;
        const stats = await dbAll(`
            SELECT s.user_id, u.username, u.avatar_url, s.points, s.wins, s.loss, s.win_rate
            FROM stats s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.points DESC
        `);
        const userRank = stats.findIndex(stat => stat.user_id === myId) + 1;

        return reply.send(userRank);
    }
    catch(err){
      console.error('get stat error:', err);
        return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
});
};
