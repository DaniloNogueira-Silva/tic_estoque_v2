import { PrismaClient } from '@prisma/client';
import { MeasureController } from '../controllers/measure.controller';
import { MeasureRepository } from '../../repositories/measure.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const measureRepository = new MeasureRepository();
const measureController = new MeasureController(measureRepository);

const measureRouter = (server: FastifyInstance, options: any, done: () => void) => {
  
    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await measureController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  server.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await measureController.create(req, reply);
      reply.status(201).send(`measure created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();

};

export default measureRouter;
