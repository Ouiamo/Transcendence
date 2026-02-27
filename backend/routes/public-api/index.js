module.exports = async function(fastify, options) {
  const { dbAll, dbGet } = require('../../utils/dbHelpers');
  
  const validApiKeys = ['pong-api-key'];
  const requestCounts = {};

  function isValidApiKey(key) {
    return validApiKeys.includes(key);
  }

  function checkRateLimit(ip) {
    const now = Date.now();
    const minute = Math.floor(now / 60000); 
    const key = ip + ':' + minute; 
    
    requestCounts[key] = (requestCounts[key] || 0) + 1;
    
    if (requestCounts[key] > 100) {
      return false;
    }
    
    return true;
  }

  fastify.get('/api/public/stats', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!isValidApiKey(apiKey)) {
      return reply.code(401).send({ error: 'Need API key' });
    }
    
    const ip = request.ip;
    if (!checkRateLimit(ip)) {
      return reply.code(429).send({
        error: 'Too many requests',
        message: 'Wait 1 minute'
      });
    }
    
    try {
      const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
      
      return reply.send({
        website: 'Pong Transcendence',
        users: userCount.count
      });
    } catch (error) {
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  fastify.get('/api/public/users', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!isValidApiKey(apiKey)) {
      return reply.code(401).send({ error: 'Need API key' });
    }
    
    const ip = request.ip;
    if (!checkRateLimit(ip)) {
      return reply.code(429).send({ error: 'Too many requests' });
    }
    
    try {
      const users = await dbAll(`
        SELECT username, created_at 
        FROM users 
        LIMIT 10
      `);
      
      return reply.send({ users: users });
    } catch (error) {
      return reply.code(500).send({ error: 'Database error' });
    }
  });

  fastify.post('/api/public/contact', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!isValidApiKey(apiKey)) {
      return reply.code(401).send({ error: 'Need API key' });
    }
    
    const ip = request.ip;
    if (!checkRateLimit(ip)) {
      return reply.code(429).send({ error: 'Too many requests' });
    }
    
    const { name, message } = request.body;
    
    if (!name || !message) {
      return reply.code(400).send({ error: 'Name and message required' });
    }
    
    return reply.send({
      success: true,
      message: 'Contact received: ' + message
    });
  });

  fastify.put('/api/public/feedback', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!isValidApiKey(apiKey)) {
      return reply.code(401).send({ error: 'Need API key' });
    }
    
    const ip = request.ip;
    if (!checkRateLimit(ip)) {
      return reply.code(429).send({ error: 'Too many requests' });
    }
    
    const { rating } = request.body;
    
    if (!rating) {
      return reply.code(400).send({ error: 'Rating required' });
    }
    
    return reply.send({
      success: true,
      message: 'Thanks for rating: ' + rating + '/5'
    });
  });

  fastify.delete('/api/public/request', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];
    if (!isValidApiKey(apiKey)) {
      return reply.code(401).send({ error: 'Need API key' });
    }
    
    const ip = request.ip;
    if (!checkRateLimit(ip)) {
      return reply.code(429).send({ error: 'Too many requests' });
    }
    
    const { request_id } = request.body;
    
    if (!request_id) {
      return reply.code(400).send({ error: 'Request ID required' });
    }
    
    return reply.send({
      success: true,
      message: 'Request ' + request_id + ' will be processed'
    });
  });

    fastify.get('/api/public', async (request, reply) => {
      const apiKey = request.headers['x-api-key'];
      if (!isValidApiKey(apiKey)) {
        return reply.code(401).send({ error: 'Need API key' });
      }
      return {
        app: 'Pong Transcendence',
        version: '1.0',
        status: 'online',
        documentation: {
          available_public_api: '/api/public/stats, /api/public/users, /api/public/contact, /api/public/feedback, /api/public/request'
        }
      };
    });
};
