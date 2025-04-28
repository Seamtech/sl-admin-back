import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { initMongoConnection } from '../lib/mongoose';
import { ensureMongoPolicies } from '../lib/mongo-policies';

export default fp(async function (fastify: FastifyInstance) {
  try {
    await initMongoConnection();
    fastify.log.info('MongoDB Connected');
    await ensureMongoPolicies();
    fastify.log.info('MongoDB Policies Establshed/Verified');
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
});
