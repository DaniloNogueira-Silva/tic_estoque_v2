import { PrismaClient } from "@prisma/client";
import { OrderController } from "../controllers/order.controller";
import { OrderRepository } from "../../repositories/order.repository";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { ProductRepository } from "../../repositories/product.repository";

const prisma = new PrismaClient();

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const orderController = new OrderController(orderRepository, productRepository);

const orderRouter = (
  server: FastifyInstance,
  options: any,
  done: () => void
) => {
  server.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await orderController.index(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Não foi possível recuperar os pedidos" });
    }
  });

  server.get("/latest", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await orderController.latest(req, reply);
      done();
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Não foi possível recuperar os últimos pedidos" });
    }
  });

  server.post(
    "/createOrder",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await orderController.createOrder(req, reply);
        reply.status(201).send(`order created`);
        done();
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Não foi possível criar um pedido" });
      }
    }
  );

  done();

  server.post(
    "/createOrderItem",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await orderController.createOrderItem(req, reply);
        reply.status(201).send(`order item created`);
        done();
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Não foi possível criar o item do pedido" });
      }
    }
  );

  done();

  server.post<{ Params: { id: string } }>(
    "/print_order/:id",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await orderController.print_order(req, reply);
        reply.status(201).send(`pdf created`);
        done();
      } catch (error) {
        console.log(error);
        reply.status(500).send({ error: "Não foi possível criar o item do pedido" });
      }
    }
  );
};

export default orderRouter;
