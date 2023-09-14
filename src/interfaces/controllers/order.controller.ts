import { FastifyRequest, FastifyReply } from "fastify";
import { OrderRepository } from "../../repositories/order.repository";
import { Order, Order_item, Product } from "@prisma/client";
import { ProductRepository } from "../../repositories/product.repository";
import pdf from "html-pdf";

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

  constructor(
    repository: OrderRepository,
    repositoryProduct: ProductRepository
  ) {
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

  print_order: RequestHandler = async (req, res) => {
    try {
      const id: number = parseInt((req.params as { id: string }).id);
      const order: Order = await this.repository.orderDetails(id);

      if (order) {
        const dataOrder = {
          name: order.name,
          created_at: order.created_at,
        };

        const data = dataOrder.created_at;
        const date = new Date(data);
        const formattedDate = new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);

        let texto = `
            <p style="margin-right: 0px"> </p>
            <h4 style="color: gray; text-align: center; margin-top: 50px "> NV SOCIEDADE SOLIDÁRIA </h4>
            <p style="color: gray; text-align: center "> Gestora do CCI Nossa Senhora da Conceição </p>
            <p style="color: gray; text-align: center "> CNPJ n. 05.166.687/0002-34 </p>
            <p style="font-weight: bold; text-align: center ">CONSOLIDAÇÃO DE PESQUISAS DE PREÇOS</p>

            <p  style=" margin-left: 50px ">ORGÃO CONCESSOR: Prefeitura Municipal de Franca </p>
            <p  style=" margin-left: 50px ">ENTIDADE CONVENIADA: NV Sociedade Solidária (CCI Municipal Nossa senhora da Conceição)</p>
            <p  style=" margin-left: 50px ">EXERCÍCIO: 2023</p>
            <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto ">
              <tr>
                <th colspan="2" style="border: 1px solid black; padding: 8px; text-align: center;"
                  >I – IDENTIFICAÇÃO DOS PROPONENTES (Fornecedores de Produtos)
                </th>
                
              </tr>
          `;

        const orderItems: OrderItem[] =
          await this.repository.findItemsByOrderId(order.id);

        orderItems.forEach((orderItem, index) => {
          const dataOrderItem = {
            status: orderItem.status,
            expected_date: orderItem.expected_date,
            quantityInStock: orderItem.quantityInStock,
            newQuantity: orderItem.newQuantity,
            orderId: orderItem.orderId,
            productId: orderItem.productId,
          };

          async function getName() {
            try {
              const data = await this.repositoryProduct.getById(dataOrderItem.productId);
              return data.name;
            } catch (error) {
              console.error(error);
              return "Nome do produto não encontrado";
            }
          }

          const productName = getName();

          const data = dataOrderItem.expected_date;
          const date = new Date(data);
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(date);

          texto += `
              <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                  Data esperada de entrega: ${formattedDate}<br> status: ${dataOrderItem.status}<br> Quantidade em estoque: ${dataOrderItem.quantityInStock}<br> Quantidade a ser pedida: ${dataOrderItem.newQuantity} <br> 
                  Nome do produto: ${productName}
                </td>
              </tr> 
          `;
        });

        texto += ` 
          </table>
          <p style="border: 1px solid black; width: 90%; text-align: center; margin-left: auto; margin-right: auto;"> IV- AUTENTICAÇÃO </p>
          <p style="margin-left: 50px ; "> Local e Data: Franca, de ${formattedDate} </p>
          <p style="margin-left: 50px ; "> Assinatura: ______________________________________________________________________ </p>
        `;

        pdf.create(texto, {}).toFile(`pdfs/${order.name}.pdf`, (err) => {
          if (err) {
            res.status(500).send("Erro ao fazer o pdf");
          } else {
            res.status(200).send("PDF criado");
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
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

      const updatedOrderItems = await Promise.all(
        order_items.map(async (orderItemData) => {
          
          const product = await this.repositoryProduct.getById(
            orderItemData.productId
          );
          if (!product) {
            throw new Error(
              `Produto com ID ${orderItemData.productId} não encontrado`
            );
          }
          
          const expectedDate = new Date(orderItemData.expected_date);

          const updatedOrderItem = await this.repository.create_order_item({
            id: orderItemData.id,
            status: orderItemData.status,
            expected_date: expectedDate,
            quantityInStock: orderItemData.quantityInStock,
            newQuantity: orderItemData.newQuantity,
            orderId: orderItemData.orderId,
            productId: orderItemData.productId
          }
            
          )
          if (orderItemData.status == "chegou") {
            await this.repositoryProduct.update(orderItemData.productId, {
              id: orderItemData.productId,
              quantity:
                orderItemData.quantityInStock + orderItemData.newQuantity,
              name: product.name,
              categoryId: product.categoryId,
              measureId: product.measureId,
              purchase_allowed: product.purchase_allowed,
              originCityHall: product.originCityHall,
              location: product.location,
            });
          } else {
            await this.repositoryProduct.update(
              orderItemData.productId,
              {
                id: orderItemData.productId,
                quantity: orderItemData.quantityInStock,
                name: product.name,
                categoryId: product.categoryId,
                measureId: product.measureId,
                purchase_allowed: product.purchase_allowed,
                originCityHall: product.originCityHall,
                location: product.location,
              }
            );
          }
          res.send({ message: "Pedido criado com sucesso", updatedOrderItem });
        })
      );
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  updateProductIfArrived: RequestHandler = async (req, res) => {
    try {
      const { order_items } = req.body as { order_items: Order_item[] };
      const params = req.params as { id: string };

      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }

      const orderItemId = Number(params.id);
      const updatedOrderItems = await Promise.all(
        order_items.map(async (orderItemData) => {
          const product = await this.repositoryProduct.getById(
            orderItemData.productId
          );
          if (!product) {
            throw new Error(
              `Produto com ID ${orderItemData.productId} não encontrado`
            );
          }
          
          console.log(orderItemId)
          const updatedOrderItem = await this.repository.updateOrder(orderItemId, {
            status: orderItemData.status,
          });
          if (orderItemData.status == "chegou") {
            await this.repositoryProduct.update(orderItemData.productId, {
              id: orderItemData.productId,
              quantity:
                orderItemData.quantityInStock + orderItemData.newQuantity,
              name: product.name,
              categoryId: product.categoryId,
              measureId: product.measureId,
              purchase_allowed: product.purchase_allowed,
              originCityHall: product.originCityHall,
              location: product.location,
            });
          }
          res.send({ message: "Pedido atualizado com sucesso", updatedOrderItem });
        })
      );
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
}
