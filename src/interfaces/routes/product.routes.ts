import { PrismaClient } from '@prisma/client';
import { ProductController } from '../controllers/product.controller';
import { ProductRepository } from '../../repositories/product.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { OrderRepository } from '../../repositories/order.repository';

const prisma = new PrismaClient();

const productRepository = new ProductRepository();
const orderRepository = new OrderRepository()
const productController = new ProductController(productRepository,orderRepository );

const productRouter = (server: FastifyInstance, options: any, done: () => void) => {
  
    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await productController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível recuperar os produtos' });
    }
  });

  server.get('/ending', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await productController.indexEnding(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível recuperar os produtos' });
    }
  });

  server.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await productController.create(req, reply);
      reply.status(201).send(`product created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível criar o produto' });
    }
  });

  server.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await productController.update(req, reply);
      reply.status(200).send(`product updated`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível atualizar o produto' });
    }
  });

  server.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await productController.delete(req, reply);
      reply.status(200).send(`product deleted`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível deletar o produto' });
    }
  });

  done();
};

export default productRouter;
