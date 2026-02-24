const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('../../../utils/dbHelpers');
require('dotenv').config();
const backendUrl = process.env.BACKEND_URL || 'https://localhost'

module.exports = async function (fastify) {

  fastify.get('/api/auth/google', async (_, reply) => {
    const url =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile'
      });

    reply.redirect(url);
  });


  fastify.get('/api/auth/google/callback', async (request, reply) => {
    const { code } = request.query;
    if (!code)
      return reply.code(400).send({ error: 'No authorization code' });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();

    const userRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );

    const googleUser = await userRes.json();

   
    let user = await dbGet(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      ['google', googleUser.id]
    );

    if (!user) {
      const result = await dbRun(
        `INSERT INTO users
     (provider, provider_id, username, email, avatar_url, firstname, lastname, password_hash) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'google',
          googleUser.id,
          googleUser.name || 'user' + Date.now(),
          googleUser.email,
          googleUser.picture || `${backendUrl}/api/avatar/file/default.png`,
          googleUser.given_name || '',
          googleUser.family_name || '',
          'OAUTH_USER',
        ]
      );
      await dbRun(`
    INSERT INTO stats (user_id, opp_username, opp_id, wins, loss, total_matches, win_rate, points)
    VALUES (?, "none", 0, 0, 0, 0, 0, 0)
  `, [result.lastID]);

      user = await dbGet(
        'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
        ['google', googleUser.id]
      );
    }

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
    })
      .redirect("https://localhost/dashboard");
  });
};
