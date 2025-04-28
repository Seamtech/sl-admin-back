import { FastifyRequest, FastifyReply } from 'fastify';

const testController = async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: 'API Response Successful!' });
};

export default testController;
