import fp from 'fastify-plugin';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/JWT.types'; 

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ message: 'Missing or invalid token' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      request.user = decoded; 
    } catch (err) {
      reply.code(401).send({ message: 'Invalid or expired token' });
    }
  });
});
