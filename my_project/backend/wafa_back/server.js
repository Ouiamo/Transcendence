
import Fastify from 'fastify';
import { userRoutes } from './routes/user.js';
//import { db } from './db.js';
//import dotenv from "dotenv";
//dotenv.config();

const fastify = Fastify({logger: true});

fastify.get('/', async (request, reply) => {
  return { hello: 'Backend is running with Fastify!' };
});

await userRoutes(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`fastify listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();