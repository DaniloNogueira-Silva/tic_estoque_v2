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
    
    try {
      const findOrderItem = await prisma.order_item.findMany({
        where: { productId: id}
      })

      if(!findOrderItem){
        const deleteResult = await prisma.product.delete({
          where: { id },
        });
  
        console.log('Produto deletado com sucesso')
        return deleteResult !== null;
      }else {
        console.log('O produto está vinculado a um ou mais pedidos')
      }
        
    } catch (error) {
      throw error
    }
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
