import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { OrderRepository } from "../../repositories/order.repository";
import { Order, Order_item, Product } from "@prisma/client";
import { ProductRepository } from "../../repositories/product.repository";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

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
      const orderInterface: Order = req.body as Order;
      const orderItemsInterface: Order_item[] = req.body as Order_item[];
  
      const createdOrder = await this.repository.create_order(orderInterface, orderItemsInterface);
  
      if (!createdOrder) {
        throw new Error("Não foi possível criar o pedido");
      }
  
      for (const orderItemInterface of orderItemsInterface) {
        const { productId, quantityInStock, newQuantity } = orderItemInterface;
  
        const product = await this.repositoryProduct.getById(productId);
        if (!product) {
          throw new Error(`Produto com ID ${productId} não encontrado`);
        }
  
        await this.repository.create_order_item(
          quantityInStock,
          newQuantity,
          orderItemInterface.status,
          orderItemInterface.expected_date,
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
          location: product.location
        });
  
        if (!updatedProduct) {
          throw new Error(`Não foi possível atualizar a quantidade do produto com ID ${productId}`);
        }
      }
  
      res.send({ message: "Pedido criado com sucesso", order: createdOrder });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
}
