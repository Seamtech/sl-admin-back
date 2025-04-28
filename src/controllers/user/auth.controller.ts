import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import UserModel from '../../models/user/User.model';
import { LoginBody } from '../../types/Auth.types';

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return reply.code(401).send({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.code(401).send({ message: 'Invalid email or password' });
    }

    const token = request.server.jwt.sign({
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
      userType: user.userType,
      companyId: user.companyId?.toString() ?? ''
    });

    return reply.send({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userType: user.userType,
      },
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Internal Server Error' });
  }
}
