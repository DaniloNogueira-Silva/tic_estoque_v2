import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryRepository } from "../../repositories/category.repository";
import { Category } from "@prisma/client";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class CategoryController {
  repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const categorys: Category[] = await this.repository.findAll();
      res.send(categorys);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  create: RequestHandler = async (req, res) => {
    try {
      const categoryInterface: Category = req.body as Category;
      const category: Category = await this.repository.create(categoryInterface);
      res.send(category);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
}