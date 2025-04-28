import { FastifyInstance } from 'fastify';
import { createCompanyHandler, getAllCompaniesHandler } from '../controllers/company/company.controller';
import { CreateCompanySchema } from '../schemas/Company.schema';

export async function companyRoutes(fastify: FastifyInstance) {
  fastify.post('/companies', {
    schema: {
      summary: 'Create a new company',
      tags: ['Company'],
      body: CreateCompanySchema,
      response: {
        201: CreateCompanySchema,
      },
      security: [{ bearerAuth: [] }],
    },
    preHandler: [fastify.authenticate],
    handler: createCompanyHandler,
  });

  fastify.get('/companies', {
    schema: {
      summary: 'Get all companies',
      tags: ['Company'],
      response: {
        200: {
          type: 'array',
          items: CreateCompanySchema,
        },
      },
    },
    handler: getAllCompaniesHandler,
  });
}
