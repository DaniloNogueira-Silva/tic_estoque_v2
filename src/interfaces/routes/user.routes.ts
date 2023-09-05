import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../../repositories/user.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const userRouter = (server: FastifyInstance, options: any, done: () => void) => {
  
    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível recuperar o usuario' });
    }
  });

  server.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.create(req, reply);
      reply.status(201).send(`user created`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível criar o usuario' });
    }
  });

  server.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await userController.update(req, reply);
      reply.status(200).send(`user updated`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível atualizar o usuario' });
    }
  });

  server.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      await userController.delete(req, reply);
      reply.status(200).send(`user deleted`);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível deletar o usuario' });
    }
  });

  server.post('/auth', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.login(req, reply);
      reply.status(201).send(`loggin accepted`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível fazer login' });
    }
  });
  done();

  server.post('/recoverPassword', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.recorverPassword(req, reply);
      reply.status(201).send(`Token enviado`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível recuperar a senha do usuario' });
    }
  });
  done();

  server.post('/changePassword', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await userController.changePassword(req, reply);
      reply.status(201).send(`Senha alterada`)
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: 'Não foi possível trocar a senha do usuario' });
    }
  });
  done();
};

export default userRouter;
