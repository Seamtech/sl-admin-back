import { FastifyRequest, FastifyReply } from 'fastify';
import CompanyModel from '../../models/company/Company.model';
import { CreateCompanyBody } from '../../schemas/Company.schema';
import { JwtPayload } from '../../types/JWT.types';

export async function createCompanyHandler(
  request: FastifyRequest<{ Body: CreateCompanyBody }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.user as JwtPayload;

    const newCompany = await CompanyModel.create({
      ...request.body,
      createdBy: userId
    });

    return reply.code(201).send(newCompany);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to create company' });
  }
}

export async function getAllCompaniesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const companies = await CompanyModel.find().lean();
    return reply.send(companies);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Failed to fetch companies' });
  }
}
