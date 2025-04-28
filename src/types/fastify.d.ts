import '@fastify/jwt';
import 'fastify';
import { preHandlerHookHandler } from 'fastify';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  userType: string;
  companyId: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: preHandlerHookHandler;
  }
}