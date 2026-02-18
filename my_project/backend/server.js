const fs = require('fs');
const path = require('path');
// const fastify = require('fastify')({
//   https: {
//     key: fs.readFileSync('certs/key.pem'), 
//     cert: fs.readFileSync('certs/cert.pem')
//   }
// });

const fastify = require('fastify')({
  logger: true,
});

require('dotenv').config();
require('./db/db');

// fastify.register(require('@fastify/cookie'), {
//   secret: process.env.COOKIE_SECRET
// });

fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest',
});


fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'access_token',
    signed: false,
  }
});

fastify.register(require('./plugins/auth'));

// fastify.register(require('@fastify/cors'), {
//   origin: 'https://localhost:5173',
//   credentials: true,
//   methods: ['GET','POST','PATCH','DELETE']
// });

// fastify.register(require('@fastify/cors'), {
//   origin: (origin, cb) => {
//     const allowed = [
//       'https://localhost:5173',
//       'https://127.0.0.1:5173',
//     ];

//     // allow server-to-server & tools (no origin)
//     if (!origin) return cb(null, true);

//     if (allowed.includes(origin)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Not allowed by CORS'), false);
//     }
//   },
//   credentials: true,
// });

fastify.register(require('@fastify/cors'), {
  origin: (origin, cb) => {
    const allowed = [
      'https://localhost',
      'https://127.0.0.1',
      // 'https://10.13.249.15' 
    ];

    // Allow requests with no origin (server-to-server, tools)
    if (!origin) return cb(null, true);

    if (allowed.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
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
fastify.register(require('./routes/profile/deleteProfile'));
fastify.register(require('./routes/game/gameSocket'));
//fastify.register(require('./routes/profile/avatar'));

// Game Socket.IO
// fastify.register(require('./routes/game/gameSocket'));

//fastify.register(require('./routes/friends/'));
// fastify.register(require('./routes/profile/avatar')); 

fastify.register(require('./routes/friends/index')); 

fastify.register(require('./routes/game/gameInvite'));

fastify.register(require('./routes/twofa/enable'));
// fastify.register(require('./routes/twofa/email'));
fastify.register(require('./routes/twofa/authenticator'));
fastify.register(require('./routes/stats/stats'));
fastify.register(require('./routes/stats/ranking'));
fastify.register(require('./routes/stats/user_ranking'));
fastify.register(require('./routes/history/history'));
fastify.register(require('./routes/public-api/index'));

// fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
//   if (err) {
//     console.error('Server error:', err);
//     process.exit(1);
//   }
// });

fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});