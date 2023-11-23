import { PrismaClient, Order, Order_item, Product } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderRepository {
  async findAll(): Promise<Order[]> {
    return prisma.order.findMany();
  }

  async latest(): Promise<Order[]> {
    const latestOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        id: "desc",
      },
    });

    return latestOrders;
  }

  async orderWithItems(): Promise<Order[]> {
    try {
      const ordersWithItems = await prisma.order.findMany({
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });
      return ordersWithItems;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch orders with items");
    }
  }

  async teste(id: number): Promise<any> {
    try {
      const orders = await prisma.order.findUnique({
        where: { id },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
      });
      return orders;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch orders with items");
    }
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

  async find(): Promise<any> {
    const orders = await prisma.order.findMany({
      include: {
        order_items: {
          where: { status: "pendente" || "Pendente" },
        },
      },
    });
    const ordersWithPendingItems = orders.filter((order) => {
      return order.order_items.some((item) => item.status === "pendente");
    });

    return ordersWithPendingItems;
  }

  async findOrderPrefeitura(): Promise<any> {
    const productPrefeitura = await prisma.product.findMany({
      where: {
        originCityHall: true,
      },
    });

    const orders = await prisma.order.findMany({
      include: {
        order_items: {
          where: {
            productId: {
              in: productPrefeitura.map((product) => product.id),
            },
          },
          include: {
            product: true,
          },
        },
      },
    });

    // Filtra apenas os pedidos que têm pelo menos um item associado com originCityHall true
    const filteredOrders = orders.filter((order) => {
      return order.order_items.some(
        (item) => item.product.originCityHall === true
      );
    });

    return filteredOrders;
  }

  async findOrderNotPrefeitura(): Promise<any> {
    const productNotPrefeitura = await prisma.product.findMany({
      where: {
        originCityHall: false,
      },
    });

    const orders = await prisma.order.findMany({
      include: {
        order_items: {
          where: {
            productId: {
              in: productNotPrefeitura.map((product) => product.id),
            },
          },
          include: {
            product: true,
          },
        },
      },
    });

    // Filtra apenas os pedidos que têm pelo menos um item associado com originCityHall true
    const filteredOrders = orders.filter((order) => {
      return order.order_items.some(
        (item) => item.product.originCityHall === false
      );
    });

    return filteredOrders;
  }

  async getId(id: number): Promise<Order[]> {
    return prisma.order.findMany({
      where: { id },
    });
  }

  async getByProductId(id: number): Promise<any> {
    return prisma.order_item.findFirst({
      where: { productId: id, status: "pendente" || "Pendente" },
    });
  }

  async findItemsByOrderId(orderId: number): Promise<Order_item[]> {
    return prisma.order_item.findMany({
      where: {
        orderId: orderId,
      },
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
          orderId: data.orderId,
          productId: data.productId,
        },
      });
      return orderItem;
    } catch (error) {
      throw new Error(`Failed to create order item: ${error.message}`);
    }
  }

  async delete(id: number): Promise<any> {
    try {
      const deleted = await prisma.order_item.deleteMany({
        where: {
          productId: id,
        },
      });

      return deleted;
    } catch (error) {
      throw new Error(`Failed to create order item: ${error.message}`);
    }
  }
}
