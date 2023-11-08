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
    return prisma.product.findFirstOrThrow({
      where: { id },
    });
  }

  async create(data): Promise<Product> {
    const { categoryId, measureId, purchase_allowed, ...productData } = data;

    let compra;
    if (data.originCityHall == true) {
      compra = false;
    } else if (data.originCityHall == false) {
      compra = true;
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        purchase_allowed: compra,
        categoryId,
        measureId,
      },
    });

    return product;
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deleteResult = await prisma.product.delete({
        where: { id },
      });

      console.log("Produto deletado com sucesso");
      return deleteResult !== null;
    } catch (error) {
      console.log("Ocorreu um erro ao deletar o produto");
    }
  }

  async update(id: number, data): Promise<Product | null> {

    if (data.originCityHall == true) {
      data.purchase_allowed = false;
    } else if (data.originCityHall == false) {
      data.purchase_allowed = true;
    }
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    if (!product) {
      return null;
    }

    return product;
  }
  catch(error) {
    console.log("Ocorreu um erro ao autalizar o produto");
  }
}
