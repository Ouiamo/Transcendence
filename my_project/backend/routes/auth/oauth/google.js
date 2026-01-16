const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('../../../utils/dbHelpers');

module.exports = async function (fastify) {
  // 🔹 Step 1: Redirect to Google
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

  // 🔹 Step 2: Callback
  fastify.get('/api/auth/google/callback', async (request, reply) => {
    const { code } = request.query;
    if (!code)
      return reply.code(400).send({ error: 'No authorization code' });

    // 1️⃣ Exchange code → token
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

    // 2️⃣ Get user profile
    const userRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );

    const googleUser = await userRes.json();

    // 3️⃣ Find or create user
    let user = await dbGet(
      'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
      ['google', googleUser.id]
    );

    if (!user) {
      await dbRun(
        `INSERT INTO users
         (provider, provider_id, username, email, avatar_url, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'google',
          googleUser.id,
          googleUser.name || 'user' + Date.now(),
          googleUser.given_name || '',
          googleUser.family_name || '',
          googleUser.email,
          'OAUTH_USER',
          googleUser.picture || 'default-avatar.png'
        ]
      );

      user = await dbGet(
        'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
        ['google', googleUser.id]
      );
    }

    // 4️⃣ Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    reply.setCookie('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/'
      })
      .redirect(process.env.FRONTEND_URL + '/Profil');
  });
};
