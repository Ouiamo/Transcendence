

module.exports = async function (fastify) {
  fastify.post('/api/logout', async (request, reply) => {
    reply
      .clearCookie('access_token', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false  
      })
      .send({ success: true, message: 'Logged out successfully' });
  });
};