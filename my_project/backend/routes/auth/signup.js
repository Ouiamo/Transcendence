const bcrypt = require('bcryptjs');
const { dbGet, dbRun } = require('../../utils/dbHelpers');

module.exports = async function(fastify){
fastify.post('/api/signup', async (request, reply) => {
    const { firstname, lastname, username, email, password } = request.body;
    
    if (!username || !email || !password) {
      return reply.code(400).send({ error: 'Username, email and password required' });
    }
    
    try {
      const existingUser = await dbGet(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );
      
      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await dbRun(
        `INSERT INTO users (provider, firstname, lastname, username, email, password_hash) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        ['local', firstname, lastname, username, email, hashedPassword]
      );
      await dbRun(`
        INSERT INTO stats (user_id, opp_username, opp_id, wins, loss, total_matches, win_rate, points)
        VALUES (?, "none", 0, 0, 0, 0, 0, 0)
      `, [result.lastID]);
      return reply.code(201).send({
        success: true,
        userId: result.lastID,
        message: 'User registered'
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      return reply.code(500).send({ error: 'Database error' });
    }
  });
};