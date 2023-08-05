import { PrismaClient } from '@prisma/client';
import { CategoryController } from '../controllers/category.controller';
import { CategoryRepository } from '../../repositories/category.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const categoryRepository = new CategoryRepository();
const categoryController = new CategoryController(categoryRepository);

const categoryRouter = (server: FastifyInstance, options: any, done: () => void) => {

  server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await categoryController.index(req, reply);
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await categoryController.create(req, reply);
      reply.status(201).send('Category created');
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Call the `done()` function here, after all routes are defined
  done();
};

export default categoryRouter;
