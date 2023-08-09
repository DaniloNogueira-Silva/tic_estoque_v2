import { PrismaClient } from '@prisma/client';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from '../../repositories/order.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { ProductRepository } from '../../repositories/product.repository';

const prisma = new PrismaClient();

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository()
const orderController = new OrderController(orderRepository, productRepository);

const orderRouter = (server: FastifyInstance, options: any, done: () => void) => {
  
    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await orderController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.post('/createOrder', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await orderController.createOrder(req, reply);
      reply.status(201).send(`order created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();

  server.post('/createOrderItem', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await orderController.createOrderItem(req, reply);
      reply.status(201).send(`order item created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
};

export default orderRouter;
