import { PrismaClient, Order, Order_item, Product } from "@prisma/client";

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

  async getIdOrderItems(id: number): Promise<Order_item[]> {
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
    try {
      const order = await prisma.order.create({
        data: {
          ...data,
        },
      });
      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async create_order_item(data: Order_item): Promise<Order_item> {
    try {
      const orderItem = await prisma.order_item.create({
        data: {
          ...data,
          orderId: data.orderId, // Certifique-se de ajustar isso para o ID correto do pedido
          productId: data.productId,
        },
      });
      return orderItem;
    } catch (error) {
      throw new Error(`Failed to create order item: ${error.message}`);
    }
  }
}
