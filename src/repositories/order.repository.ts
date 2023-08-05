import { PrismaClient, Order, Order_item } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderRepository {
  async findAll(): Promise<Order[]> {
    return prisma.order.findMany();
  }

  async orderDetails(id: number): Promise<Order | null> {
    if (isNaN(id)) {
      throw new Error("Invalid ID provided");
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          order_items: true,
        },
      });

      return order;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch order");
    }
  }

  async getId(id: number): Promise<Order[]> {
    return prisma.order.findMany({
      where: { id },
    });
  }

  async getIdOrderItems(id: number): Promise<Order[]> {
    return prisma.order_item.findMany({
      where: { id },
    });
  }

  async updateOrder(
    id: number,
    data: Partial<Order_item>
  ): Promise<Order_item | null> {
    if (isNaN(id)) {
      throw new Error("Invalid ID provided");
    }

    try {
      // Verificar se o order_item com o ID fornecido existe antes de atualizar
      const existingOrderItem = await prisma.order_item.findUnique({
        where: { id },
      });

      if (!existingOrderItem) {
        return null; // O registro com o ID fornecido não existe
      }

      const updatedOrderItem = await prisma.order_item.update({
        where: { id },
        data,
      });

      return updatedOrderItem;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update order item");
    }
  }

  async create_order(data: Order): Promise<Order> {
    const { ...userData } = data;

    const order = await prisma.order.create({
      data: {
        ...userData,
      },
    });
    return order;
  }

  async create_order_item(
    data: Order_item,
    id_product: number,
    id_order: number
  ): Promise<Order_item> {
    const { ...userData } = data;

    const order_item = await prisma.order_item.create({
      data: {
        ...userData,
        id_order,
        id_product,
      },
    });
    return order_item;
  }
}
