import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { buildError } from '../utils/response.utils';

/**
 * Determines whether a request should be logged.
 * Only log requests if the URL starts with `/api/`.
 */
function shouldLogRequest(req: FastifyRequest): boolean {
  return req.url.startsWith('/api/');
}

export default async function loggingHooks(app: FastifyInstance) {
  // Log incoming API requests.
  app.addHook('onRequest', async (req: FastifyRequest) => {
    if (!shouldLogRequest(req)) return;
    req.log.info(
      {
        // Let Fastify naturally include the req property.
        reqBody: req.body, // Sensitive fields are redacted by logger config.
      },
      'incoming request: Incoming request'
    );
  });

  // Log outgoing API responses.
  app.addHook(
    'onSend',
    async (req: FastifyRequest, reply: FastifyReply, payload: any): Promise<any> => {
      if (!shouldLogRequest(req)) return payload;
      req.log.info(
        {
          statusCode: reply.statusCode,
        },
        'response: Request completed'
      );
      return payload;
    }
  );

  // Log errors for API requests.
  app.addHook(
    'onError',
    async (req: FastifyRequest, reply: FastifyReply, error: Error): Promise<void> => {
      if (shouldLogRequest(req)) {
        req.log.error(
          {
            err: error,
            statusCode: reply.statusCode,
          },
          'error: Request errored'
        );
      }
      const errorResponse = buildError(
        error.message || 'Unexpected error',
        process.env.NODE_ENV === 'development' ? error.stack : undefined
      );
      reply.code(500).send(errorResponse);
    }
  );
}
