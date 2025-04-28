import { FastifyInstance } from 'fastify';

export async function ingestionRoutes(fastify: FastifyInstance) {
  fastify.post('/ingest', {
    // no schema = accept any JSON
    // add `preHandler: [fastify.authenticate]` here if you want to protect it
    handler: async (request, reply) => {
      const payload = request.body;
      // TODO: do something with `payload` (e.g. persist to DB, trigger jobs, etc.)
      console.log('Received webhook payload:', payload);
      return reply.code(200).send({ status: 'ok' });
    }
  });
}
