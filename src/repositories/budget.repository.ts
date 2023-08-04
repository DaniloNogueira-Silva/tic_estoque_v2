import {
  PrismaClient,
  Budget,
  Budget_company,
  Budget_product,
} from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<Budget[]> {
    return prisma.budget.findMany();
  }

  async budgetDetails(id: number): Promise<Budget | null> {
    if (isNaN(id)) {
      throw new Error("Invalid ID provided");
    }

    try {
      const budget = await prisma.budget.findUnique({
        where: { id },
        include: {
          budget_companies: true,
          budget_product: true,
        },
      });

      return budget;
    } catch (error) {
      console.log(error)
      throw new Error("Failed to fetch budget");
    }
  }

  async findCompanies(): Promise<Budget_company[]>{
    return prisma.budget_company.findMany()
  }

  async getById(id: number): Promise<Budget[]>{
    return prisma.budget.findMany({
        where: {id}
    })
  }

  async create_budget(data: Budget): Promise<Budget> {
    const { ...userData } = data;

    const budget = await prisma.budget.create({
      data: {
        ...userData,
      },
    });
    return budget;
  }

  async create_budget_company(data: Budget_company): Promise<Budget_company> {
    const { ...userData } = data;

    const budget = await prisma.budget_company.create({
      data: {
        ...userData,
      },
    });
    return budget;
  }

  async create_budget_product(data: Budget_product): Promise<Budget_product> {
    const { ...userData } = data;

    const budget = await prisma.budget_product.create({
      data: {
        ...userData,
      },
    });
    return budget;
  }
}
