import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async getById(id: number): Promise<Product> {
    return prisma.product.findUnique({
        where: {id}
    });
  }

  async create(data: Product): Promise<Product> {
    const { id_category, id_unit_measure, ...productData } = data;


    const product = await prisma.product.create({
      data: {
        ...productData,
        id_category,
        id_unit_measure 
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
