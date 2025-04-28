import { FastifyInstance } from 'fastify';
import { createUserHandler, getAllUsersHandler } from '../../controllers/user/user.controller';
import { ErrorResponse } from '../../schemas/responses/base.response'; // fixed path
import { CreateUserResponse, GetAllUsersResponse } from '../../schemas/responses/user.response';
import { CreateUserSchema } from '../../schemas/User.schema';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', {
    schema: {
      summary: 'Get all users',
      tags: ['User'],
      response: {
        200: GetAllUsersResponse,
        500: ErrorResponse,
      },
    },
    handler: getAllUsersHandler,
  });

    fastify.post('/auth/register', {
      schema: {
        summary: 'Register a new user',
        tags: ['User'],
        body: CreateUserSchema,
        response: {
          201: CreateUserResponse,
          400: ErrorResponse,
          500: ErrorResponse,
        },
      },
      handler: createUserHandler,
    });
}
