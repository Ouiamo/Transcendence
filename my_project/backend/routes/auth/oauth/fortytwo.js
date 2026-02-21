const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('../../../utils/dbHelpers');

require('dotenv').config();
const backendUrl = process.env.BACKEND_URL || 'https://localhost'

module.exports = async function (fastify) {

  fastify.get('/api/auth/42', async (_, reply) => {
    const url = 'https://api.intra.42.fr/oauth/authorize?' +
      new URLSearchParams({
        client_id: process.env.FORTYTWO_CLIENT_ID,
        redirect_uri: process.env.FORTYTWO_REDIRECT_URI,
        response_type: 'code',
        scope: 'public',
      });

    reply.redirect(url);
  });

  fastify.get('/api/auth/42/callback', async (request, reply) => {
    const { code } = request.query;
    if (!code)
      return reply.code(400).send({ error: 'No authorization code' });

    // 1️⃣ Exchange token
    const tokenRes = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code,
        redirect_uri: process.env.FORTYTWO_REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();

    // 2️⃣ Fetch user
    const userRes = await fetch('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user42 = await userRes.json();

    // 3️⃣ DB
    let user = await dbGet(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      ['42', user42.id]
    );

    if (!user) {
      const result = await dbRun(
        `INSERT INTO users
         (provider, provider_id, username, email, avatar_url, firstname, lastname, password_hash) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          '42',
          user42.id,
          user42.login ||'user' + Date.now(),
          user42.email,
          user42.image?.link || `${backendUrl}/api/avatar/file/default-avatar.png`,
          user42.first_name || '',
          user42.last_name || '',
          'OAUTH_USER'
        ]
      );
      await dbRun(`
        INSERT INTO stats (user_id, opp_username, opp_id, wins, loss, total_matches, win_rate, points)
        VALUES (?, "none", 0, 0, 0, 0, 0, 0)
      `, [result.lastID]); 

      user = await dbGet(
        'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
        ['42', user42.id]
      );
    }

    // 4️⃣ JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    reply.setCookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 10
      }).redirect((process.env.FRONTEND_URL || 'https://localhost') + '/dashboard');
  });
};
