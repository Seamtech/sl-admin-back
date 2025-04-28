import { FastifyInstance } from 'fastify';
import loggingHooks from './loggingHooks';
import swaggerPlugin from './swagger';
import mongoPlugin from './mongodb';

export default async function registerPlugins(app: FastifyInstance) {
  // Logging hooks plugin: registers hooks for logging requests, responses, and errors.
  app.register(loggingHooks);
  
  // Swagger plugin (includes both openapi and Swagger UI).
  app.register(swaggerPlugin);
  
  // MongoDB plugin for database connection.
  app.register(mongoPlugin);

}
