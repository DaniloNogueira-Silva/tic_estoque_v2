import { FastifyRequest, FastifyReply } from "fastify";
import { ProductRepository } from "../../repositories/product.repository";
import { Product } from "@prisma/client";
import { OrderRepository } from "../../repositories/order.repository";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class ProductController {
  repository: ProductRepository;
  orderRepository: OrderRepository;

  constructor(repository: ProductRepository, orderRepository: OrderRepository) {
    this.repository = repository;
    this.orderRepository = orderRepository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const products: Product[] = await this.repository.findAll();
      res.send(products);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  create: RequestHandler = async (req, res) => {
    try {
      const product = await this.repository.create(req.body);
      res.send(product);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  };

  update: RequestHandler = async (req, res) => {
    const productInterface = req.body;

    if (!productInterface) {
      res.status(400).send({ error: "Invalid product data" });
      return;
    }

    const params = req.params as { id: string };
    const productId = Number(params.id);

    if (typeof params.id !== "string") {
      res.status(400).send({ error: "Invalid id" });
      return;
    }

    const productExists = await this.repository.getById(productId);

    if (!productExists) {
      res.status(404).send({ error: "Não existe produto com esse ID" });
      return;
    }

    const findOrderItem = await this.orderRepository.getByProductId(productId);

    if (!findOrderItem) {
      const product: Product | null = await this.repository.update(
        productId,
        productInterface
      );
      res.code(200).send(product);
    } else {
      if (findOrderItem.status != "Chegou") {
        res
          .status(404)
          .send({ error: "Produto esta vinculado a um ou mais pedidos" });
        return;
      }

    }

    const product: Product | null = await this.repository.update(
      productId,
      productInterface
    );

    res.code(200).send(product);
  };

  delete: RequestHandler = async (req, res) => {
    const params = req.params as { id: string };

    if (typeof params.id !== "string") {
      res.status(400).send({ error: "Invalid id" });
      return;
    }

    const productId = Number(params.id);
    const product = await this.repository.getById(productId);

    if (!product) {
      res.status(404).send({ error: "Produto não encontrado" });
      return;
    }

    const findOrderItem = await this.orderRepository.getByProductId(productId);

    if (findOrderItem) {
      res
        .status(404)
        .send({ error: "Produto esta vinculado a um ou mais pedidos" });
      return;
    } else {
      // for (const orderItem of findOrderItem) {
      //   const orderItemId = orderItem.id;
      //   console.log(orderItemId)

      //   await this.orderRepository.delete(orderItemId);
      // }

      const deleted = await this.orderRepository.delete(productId);
      console.log(deleted)
    }

    await this.repository.delete(productId);
    res.code(200).send({ message: "Produto deletado com sucesso" });
  };
}
