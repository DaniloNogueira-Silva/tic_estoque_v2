import { FastifyRequest, FastifyReply } from "fastify";
import { OrderRepository } from "../../repositories/order.repository";
import { Order, Order_item, Product } from "@prisma/client";
import { ProductRepository } from "../../repositories/product.repository";
import pdf from "html-pdf";
import fs from "fs";
import path from "path";

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

  orderWithItems: RequestHandler = async (req, res) => {
    try {
      res.send(await this.repository.orderWithItems());
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

        const imagePath = "image/creche.jpg";
        const imageBase64 = fs.readFileSync(path.resolve(imagePath), "base64");

        let texto = `
            <p style="margin-right: 0px"> <img src="data:image/jpeg;base64,${imageBase64}" alt="Logo da creche"> </p>
            <p style="margin-right: 0px"> </p>
            <h4 style="color: gray; text-align: center; margin-top: 50px "> NV SOCIEDADE SOLIDÁRIA </h4>
            <p style="color: gray; text-align: center "> Gestora do CCI Nossa Senhora da Conceição </p>
            <p style="color: gray; text-align: center "> CNPJ n. 05.166.687/0002-34 </p>
            <p style="font-weight: bold; text-align: center ">RELATÓRIO DE PEDIDOS</p>

            <p  style=" margin-left: 50px ">ORGÃO CONCESSOR: Prefeitura Municipal de Franca </p>
            <p  style=" margin-left: 50px ">ENTIDADE CONVENIADA: NV Sociedade Solidária (CCI Municipal Nossa senhora da Conceição)</p>
            <p  style=" margin-left: 50px ">EXERCÍCIO: 2023</p>
            <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto ">
            <tr>
            <th colspan="6" style="border: 1px solid black; padding: 8px; text-align: center;">
              II – Detalhes dos Pedidos (R$)
            </th>
          </tr>
          <tr>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Nome do produto
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Data de entrega
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Situação do pedido
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Quantidade em estoque
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Quantidade a ser adicionada
            </th>
          </tr>
          `;

        const orderItems = await this.repository.teste(id);

        for (let i = 0; i < orderItems.order_items.length; i++) {
          const currentItem = orderItems.order_items[i];

          const expectedDate = new Date(currentItem.expected_date);
          const format = new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(expectedDate);

          texto += `
              <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                  ${currentItem.product.name}
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                  ${format}
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                   ${currentItem.status}
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                   ${currentItem.quantityInStock}
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                   ${currentItem.newQuantity}
                </td>
              </tr>`;
        }

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

          const updatedOrderItem = await this.repository.create_order_item({
            id: orderItemData.id,
            status: orderItemData.status,
            expected_date: orderItemData.expected_date,
            quantityInStock: orderItemData.quantityInStock,
            newQuantity: orderItemData.newQuantity,
            orderId: orderItemData.orderId,
            productId: orderItemData.productId,
          });
          await this.repositoryProduct.update(orderItemData.productId, {
            id: orderItemData.productId,
            quantity: orderItemData.quantityInStock,
            name: product.name,
            categoryId: product.categoryId,
            measureId: product.measureId,
            purchase_allowed: product.purchase_allowed,
            originCityHall: product.originCityHall,
            location: product.location,
          });
          res.send({ message: "Pedido criado com sucesso", updatedOrderItem });
        })
      );
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  updateProductIfArrived: RequestHandler = async (req, res) => {
    try {
      const params = req.params as { id: string };

      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }

      const orderItemId = Number(params.id);

      const getOrderItem = await this.repository.getIdOrderItems(orderItemId);

      const productId = getOrderItem[0].productId;

      const product = await this.repositoryProduct.getById(productId);

      if (!product) {
        throw new Error(
          `Produto com ID ${getOrderItem[0].productId} não encontrado`
        );
      }

      await this.repository.updateOrder(orderItemId, {
        status: "Chegou",
      });

      const updatedProduct = await this.repositoryProduct.update(product.id, {
        id: product.id,
        quantity: getOrderItem[0].quantityInStock + getOrderItem[0].newQuantity,
        name: product.name,
        categoryId: product.categoryId,
        measureId: product.measureId,
        purchase_allowed: product.purchase_allowed,
        originCityHall: product.originCityHall,
        location: product.location,
      });
      res.send({ message: "Pedido atualizado com sucesso", updatedProduct });
    } catch (error) {
      res.status(500).send({ message: error.message, error: error });
    }
  };
}
