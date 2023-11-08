import { PrismaClient } from '@prisma/client';
import { BudgetController } from '../controllers/budget.controller';
import { BudgetRepository } from '../../repositories/budget.repository';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

const budgetRepository = new BudgetRepository();
const budgetController = new BudgetController(budgetRepository);

const BudgetRouter = (server: FastifyInstance, options: any, done: () => void) => {

    server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.index(req, reply);
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    server.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
        try {
          await budgetController.delete(req, reply);
          reply.status(200).send(`budget deleted`);
          done();
        } catch (error) {
          console.log(error);
          reply.status(500).send({ error: 'Não foi possível deletar o orçamento' });
        }
      });

    server.get<{ Params: { id: string } }>('/budgetDetails/:id', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.budgetDetails(req, reply);
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post('/createBudget', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.create_budget(req, reply);
            reply.status(201).send(`product created`)
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post('/createBudgetCompany', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.create_budget_company(req, reply);
            reply.status(201).send(`product created`)
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post('/createBudgetProduct', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.create_budget_product(req, reply);
            reply.status(201).send(`product created`)
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post<{ Params: { id: string } }>('/print_budget/:id', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await budgetController.print_budget(req, reply);
            reply.status(201).send(`PDF created`)
            done();
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
    
    done()
};

export default BudgetRouter;
