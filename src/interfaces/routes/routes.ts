import { FastifyInstance } from 'fastify';
import userRouter from './user.routes'
import categoryRouter from './category.routes';
import measureRouter from './measure.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';
import budgetRouter from './budget.routes';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

const server: FastifyInstance = fastify();
server.register(fastifyCors);

const routes = (server: FastifyInstance): void => {
  server.register(userRouter, { prefix: '/admin/user' });
  server.register(categoryRouter, { prefix: '/admin/category' });
  server.register(measureRouter, { prefix: '/admin/measure' });
  server.register(productRouter, { prefix: '/admin/product' });
  server.register(orderRouter, { prefix: '/admin/order' });
  server.register(budgetRouter, { prefix: '/admin/budget' });
};

export default routes