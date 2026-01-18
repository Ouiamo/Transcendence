const fs = require('fs');
const path = require('path');
const fastify = require('fastify')({
  https: {
    key: fs.readFileSync(path.join(__dirname, './certs/.key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem')),
  }
});

require('dotenv').config();
require('./db/db');

fastify.register(require('./plugins/auth'));

fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE']
});

fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET
});

fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
});

fastify.register(require('fastify-multipart'));


fastify.register(require('./routes/auth/root'));
fastify.register(require('./routes/auth/signup'));
fastify.register(require('./routes/auth/login'));
fastify.register(require('./routes/auth/logout'));
fastify.register(require('./routes/auth/oauth/google'));
fastify.register(require('./routes/auth/oauth/fortytwo'));

fastify.register(require('./routes/profile/getProfile'));
fastify.register(require('./routes/profile/updateProfile'));
fastify.register(require('./routes/profile/avatar')); 

fastify.register(require('./routes/friends/index')); 

fastify.register(require('./routes/twofa/enable'));
fastify.register(require('./routes/twofa/email'));
fastify.register(require('./routes/twofa/authenticator'));


fastify.register(require('./routes/public-api/index'));

fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error('Server error:', err);
    process.exit(1);
  }
  console.log('Server running on https://localhost:3010');
});