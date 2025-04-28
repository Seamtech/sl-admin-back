import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import UserModel from '../../models/user/User.model';
import CompanyModel from '../../models/company/Company.model';
import { CreateUserBody } from '../../schemas/User.schema';
import { buildSuccess, buildError } from '../../utils/response.utils';

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  try {
    const { email, password, role, userType, companyId } = request.body;

    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return reply.code(400).send(buildError('Email is already in use'));
    }

    if (companyId) {
      const companyExists = await CompanyModel.exists({ _id: companyId });
      if (!companyExists) {
        return reply
          .code(400)
          .send(buildError('Provided companyId does not exist.'));
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      role,
      userType,
      companyId: companyId || undefined,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return reply
      .code(201)
      .send(buildSuccess('User successfully created.', userWithoutPassword));
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send(buildError('Internal Server Error', (error as Error).message));
  }
}

export async function getAllUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await UserModel.find().select('-password').lean();

    return reply.send(buildSuccess('Users fetched successfully.', users));
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send(buildError('Failed to fetch users.', (error as Error).message));
  }
}
