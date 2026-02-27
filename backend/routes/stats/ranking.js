module.exports = async function (fastify) {
const jwt = require('jsonwebtoken');
const { dbAll } = require('../../utils/dbHelpers');

fastify.get('/api/ranking', { preHandler: fastify.authenticate }, async (request, reply) => {

    try {
        const stats = await dbAll(`
            SELECT s.user_id, u.username, u.avatar_url, u.provider, s.points, s.wins, s.loss, s.win_rate
            FROM stats s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.points DESC
        `);
        stats.forEach((element) => {
            if (element.provider === "local")
                element.avatar_url = "/api/avatar/file/" + element.avatar_url;
        });
    return reply.send(stats);
    }
    catch(err){
      console.error('get stat error:', err);
        return reply.code(500).send({ error: 'Server error: ' + err.message });
    }
});

};
