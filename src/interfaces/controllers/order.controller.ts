import { FastifyRequest, FastifyReply } from "fastify";
import { OrderRepository } from "../../repositories/order.repository";
import { Order, Order_item } from "@prisma/client";
import { ProductRepository } from "../../repositories/product.repository";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

interface OrderItem {
  id: number;
  status: string;
  expected_date: Date;
  quantityInStock: number;
  newQuantity: number;
  orderId: number;
  productId: number;
}

interface OrderRequest {
  name: string;
  order_items: OrderItem[];
}

export class OrderController {
  repository: OrderRepository;
  repositoryProduct: ProductRepository;

  constructor(repository: OrderRepository, repositoryProduct: ProductRepository) {
    this.repository = repository;
    this.repositoryProduct = repositoryProduct;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const orders: Order[] = await this.repository.findAll();
      res.send(orders);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  latest: RequestHandler = async (req, res) => {
    try {
      const orders: Order[] = await this.repository.latest();
      res.send(orders);
    } catch (error) {
      res.status(500).send({ error: "Erro ao acessar o repositório latest" });
    }
  };



  createOrder: RequestHandler = async (req, res) => {
    try {
      const orderInterface = req.body as Order;
      const createdOrder = await this.repository.create_order(orderInterface);
      if (!createdOrder) {
        throw new Error("Não foi possível criar o pedido");
      }

      res.send({ message: "Pedido criado com sucesso", createdOrder });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };

  createOrderItem: RequestHandler = async (req, res) => {
    try {

      const { order_items } = req.body as { order_items: Order_item[] };

      const createdOrderItems = await Promise.all(order_items.map(async (orderItemData) => {
        const product = await this.repositoryProduct.getById(orderItemData.productId);
        if (!product) {
          throw new Error(`Produto com ID ${orderItemData.productId} não encontrado`);
        }

        const createdOrderItem = await this.repository.create_order_item(orderItemData);
        const updatedProduct = await this.repositoryProduct.update(orderItemData.productId, {
          id: orderItemData.productId,
          quantity: orderItemData.newQuantity,
          name: product.name,
          categoryId: product.categoryId,
          measureId: product.measureId,
          purchase_allowed: product.purchase_allowed,
          originCityHall: product.originCityHall,
          location: product.location,
        });
        res.send({ message: "Pedido criado com sucesso", createdOrderItem });
      }));
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}
