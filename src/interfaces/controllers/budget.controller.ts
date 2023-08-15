import { FastifyRequest, FastifyReply } from "fastify";
import { BudgetRepository } from "../../repositories/budget.repository";
import { Budget, Budget_company, Budget_product } from "@prisma/client";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class BudgetController {
  repository: BudgetRepository;

  constructor(repository: BudgetRepository) {
    this.repository = repository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const budgets: Budget[] = await this.repository.findAll();
      res.send(budgets);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  budgetDetails: RequestHandler = async (req, res) => {
    try {
        const id: number = parseInt((req.params as { id: string }).id);
        const budget: Budget = await this.repository.budgetDetails(id);
        res.send(budget);
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
  };

  create_budget: RequestHandler = async (req, res) => {
    try {
      const budgetInterface: Budget = req.body as Budget;
      const budget: Budget = await this.repository.create_budget(
        budgetInterface
      );
      res.send(budget);
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  create_budget_company: RequestHandler = async (req, res) => {
    try {
      const budgetInterface: Budget_company = req.body as Budget_company;
      const budget_company: Budget_company =
        await this.repository.create_budget_company(budgetInterface);
      res.send(budget_company);
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  create_budget_product: RequestHandler = async (req, res) => {
    try {
      const budgetInterface: Budget_product = req.body as Budget_product;
      const budget_product: Budget_product =
        await this.repository.create_budget_product(budgetInterface);
      res.send(budget_product);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
}
