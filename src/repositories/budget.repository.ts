import {
  PrismaClient,
  Budget,
  Budget_company,
  Budget_product,
} from "@prisma/client";

const prisma = new PrismaClient();

export class BudgetRepository {
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
      console.log(error);
      throw new Error("Failed to fetch budget");
    }
  }

  async delete(id: number): Promise<Budget | null> {
    if (isNaN(id)) {
      throw new Error("Invalid ID provided");
    }

    try {
      const budgetProduct = await prisma.budget_product.deleteMany({
        where: { budgetId: id },
      });

      const budgetCompanie = await prisma.budget_company.deleteMany({
        where: { budgetId: id },
      });

      const budget = await prisma.budget.delete({
        where: { id },
      });

      return budget;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch budget");
    }
  }

  async findCompaniesByBudgetId(budgetId: number): Promise<Budget_company[]> {
    return prisma.budget_company.findMany({
      where: {
        budgetId: budgetId,
      },
    });
  }

  async findProductsByBudgetId(budgetId: number): Promise<Budget_product[]> {
    return prisma.budget_product.findMany({
      where: {
        budgetId: budgetId,
      },
    });
  }

  async create_budget(data: Budget): Promise<Budget> {
    const budget = await prisma.budget.create({
      data: {
        ...data,
      },
    });
    return budget;
  }

  async create_budget_company(data: Budget_company): Promise<Budget_company> {
    const budget = await prisma.budget_company.create({
      data: {
        ...data,
        budgetId: data.budgetId,
      },
    });
    return budget;
  }

  async create_budget_product(data: Budget_product): Promise<Budget_product> {
    const budget = await prisma.budget_product.create({
      data: {
        ...data,
        budgetId: data.budgetId,
        budget_companyId: data.budget_companyId,
      },
    });
    return budget;
  }
}
