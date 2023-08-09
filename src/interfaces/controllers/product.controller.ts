import { FastifyRequest, FastifyReply } from "fastify";
import { ProductRepository } from "../../repositories/product.repository";
import { Product } from "@prisma/client";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class ProductController {
  repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
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
      const productInterface = req.body as Product;
  
      if (!productInterface) {
        res.status(400).send({ error: "Invalid product data" });
        return;
      }
  
      const product: Product = await this.repository.create(productInterface);
      res.send(product);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  
  update: RequestHandler = async (req, res) => {
    try {
      const productInterface = req.body as Product;
  
      if (!productInterface) {
        res.status(400).send({ error: "Invalid product data" });
        return;
      }
  
      const params = req.params as { id: string };
  
      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }
  
      const productId = Number(params.id);
      const product: Product | null = await this.repository.update(productId, productInterface);
  
      if (!product) {
        res.status(404).send({ error: "Product not found" });
        return;
      }
  
      res.send(product);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };
  
  delete: RequestHandler = async (req, res) => {
    try {
      const params = req.params as { id: string };

      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }

      const productId = Number(params.id);
      const deleted: boolean = await this.repository.delete(productId);

      if (!deleted) {
        res.status(404).send({ error: "Product not found" });
        return;
      }

      res.code(204).send();
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };
}