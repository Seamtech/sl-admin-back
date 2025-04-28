import { VerifyPayloadType } from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

export async function verifyJwt<T extends VerifyPayloadType>(
  fastify: FastifyInstance,
  token: string
): Promise<T | null> {
  try {
    const decoded = await fastify.jwt.verify<T>(token);
    return decoded;
  } catch (err) {
    fastify.log.error({ err }, 'Failed to verify JWT');
    return null;
  }
}
