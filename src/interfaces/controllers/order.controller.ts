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
  

  create: RequestHandler = async (req, res) => {
    try {
      const { name, order_items }: OrderRequest = req.body;
  
      const createdOrder = await this.repository.create_order(name);
  
      if (!createdOrder) {
        throw new Error("Não foi possível criar o pedido");
      }
  
      for (const orderItemInterface of order_items) {
        const { productId, quantityInStock, newQuantity, status, expected_date } = orderItemInterface;
  
        const product = await this.repositoryProduct.getById(productId);
        if (!product) {
          throw new Error(`Produto com ID ${productId} não encontrado`);
        }
  
        await this.repository.create_order_item(
          quantityInStock,
          newQuantity,
          status,
          expected_date,
          productId,
          createdOrder.id
        );
  
        const updatedProduct = await this.repositoryProduct.update(productId, {
          id: productId,
          quantity: newQuantity,
          name: product.name,
          categoryId: product.categoryId,
          measureId: product.measureId,
          purchase_allowed: product.purchase_allowed,
          originCityHall: product.originCityHall,
          location: product.location,
        });
      }
  
      res.send({ message: "Pedido criado com sucesso", createdOrder });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };
  
}
