import { PrismaClient } from '@prisma/client';
import { ProductController } from '../controllers/product.controller';
import { ProductRepository } from '../../repositories/product.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const productRepository = new ProductRepository();
const productController = new ProductController(productRepository);

const productRouter = (server: FastifyInstance, options: any, done: () => void) => {
  
    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await productController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await productController.create(req, reply);
      reply.status(201).send(`product created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await productController.update(req, reply);
      reply.status(200).send(`product updated`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await productController.delete(req, reply);
      reply.status(200).send(`product deleted`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
};

export default productRouter;
