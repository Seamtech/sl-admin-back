import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

import registerPlugins from './plugins/registerPlugins';
import { JwtPayload } from './types/JWT.types';
import { companyRoutes } from './routes/company.routes';
import { authRoutes } from './routes/user/auth.routes';
import userRoutes from './routes/user/user.routes';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { ingestionRoutes } from './routes/ingestion.routes';

const env = process.env.NODE_ENV || 'production';
const isDev = env === 'development';

const app = Fastify({
  logger: {
    level: 'info',
    // Sensitive fields are automatically redacted by Pino using these settings.
    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'req.body.accessToken',
      'resPayload.sensitiveData',
    ],
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : {
          target: path.resolve(__dirname, './log/pino-mongo-transport.js'),
        },
    // Serializers are omitted intentionally to preserve full log payloads.
  },
});
 
// Integral configuration: CORS is core to how your server handles requests.
app.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Integral configuration: Register JWT plugin.
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'FALLBACKSEC',
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'My Admin API',
      description: 'API documentation for Admin Dashboard',
      version: '0.1.0',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
});

// Register Swagger UI.
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// JWT decorator remains in app.ts so it’s directly visible in the core configuration.
app.decorate('authenticate', async function (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify<JwtPayload>();
  } catch (err) {
    reply
      .code(401)
      .send({ message: 'Unauthorized', error: (err as Error).message });
  }
});

// Register non-integral plugins (logging, swagger, routes, Mongo, etc.)
registerPlugins(app);

  // Route registrations
  app.register(userRoutes, { prefix: '/api' });
  app.register(authRoutes, { prefix: '/api' });
  app.register(companyRoutes, { prefix: '/api' });
  app.register(ingestionRoutes, { prefix: '/api' });

export default app;
