import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async create(data: Category): Promise<Category> {
    const { ...categoryData } = data;

    const category = await prisma.category.create({
      data: {
        ...categoryData,
      },
    });

    return category;
  }
}
