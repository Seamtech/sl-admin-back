import { FastifyInstance } from 'fastify';
import { loginHandler } from '../../controllers/user/auth.controller';
import { createUserHandler } from '../../controllers/user/user.controller';
import {
  LoginSchema,
  LoginResponseSchema
} from '../../schemas/Auth.schema';
import { CreateUserSchema } from '../../schemas/User.schema';
import { ErrorResponse } from '../../schemas/responses/base.response';
import { CreateUserResponse, LoginResponse } from '../../schemas/responses/user.response';

export async function authRoutes(fastify: FastifyInstance) {


  fastify.post('/auth/login', {
    schema: {
      summary: 'User Login',
      tags: ['User'],
      body: LoginSchema,
      response: {
        201: LoginResponse,
        400: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: loginHandler,
  });
}
