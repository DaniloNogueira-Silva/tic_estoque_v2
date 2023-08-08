import { PrismaClient, Product, Category, Unit_Measure } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      include: {
        category: true,
        unit_measure: true,
      },
    });
  }

  async getById(id: number): Promise<Product> {
    return prisma.product.findUnique({
        where: { id }
    });
  }

  async create(data: Product): Promise<Product> {
    const { categoryId, measureId, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId,
        measureId 
      },
    });

    return product;
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await prisma.product.delete({
      where: { id },
    });
    return deleteResult !== null;
  }

  async update(id: number, data: Product): Promise<Product | null> {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    if (!product) {
      return null;
    }
    return product;
  }
}
