const fastify = require('fastify')();
const db = require('better-sqlite3')('pong.db');

fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST']
});


db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

fastify.get('/api/players', (request, reply) => {
  const players = db.prepare('SELECT * FROM players').all();
  return { players };
});

fastify.post('/api/players', (request, reply) => {
  const { name } = request.body;
  
  if (!name) {
    return reply.code(400).send({ error: 'Name is required' });
  }
  
  try {
    const result = db.prepare('INSERT INTO players (name) VALUES (?)').run(name);
    return { 
      success: true, 
      playerId: result.lastInsertRowid
    };
  } catch (error) {
    console.error('Database error:', error);
    return reply.code(500).send({ error: 'Database error' });
  }
});

fastify.listen({ port: 3010, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3010');
});