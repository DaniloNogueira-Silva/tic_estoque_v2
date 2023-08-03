import { FastifyInstance } from 'fastify';
import userRouter from './user.routes'
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

const server: FastifyInstance = fastify();
server.register(fastifyCors);

const routes = (server: FastifyInstance): void => {
  server.register(userRouter, { prefix: '/admin/user' });
};

export default routes