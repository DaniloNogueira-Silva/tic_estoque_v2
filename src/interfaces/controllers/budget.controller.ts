import { FastifyRequest, FastifyReply } from "fastify";
import { BudgetRepository } from "../../repositories/budget.repository";
import { Budget, Budget_company, Budget_product } from "@prisma/client";
import fs from "fs"
import path from "path"
import pdf from "html-pdf"

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class BudgetController {
  repository: BudgetRepository;

  constructor(repository: BudgetRepository) {
    this.repository = repository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const budgets: Budget[] = await this.repository.findAll();
      res.send(budgets);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  budgetDetails: RequestHandler = async (req, res) => {
    try {
      const id: number = parseInt((req.params as { id: string }).id);
      const budget: Budget = await this.repository.budgetDetails(id);

      res.send(budget);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  delete: RequestHandler = async (req, res) => {
    try {
      const id: number = parseInt((req.params as { id: string }).id);
      const budget: Budget = await this.repository.delete(id);

      res.send(budget);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  showCompanies: RequestHandler = async (req, res) => {
    try {
      const budgetId: number = parseInt((req.params as { id: string }).id);
      const budgetsCompany: Budget_company[] = await this.repository.findCompaniesByBudgetId(budgetId);
      res.send(budgetsCompany);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  create_budget: RequestHandler = async (req, res) => {
    try {
      const budgetInterface: Budget = req.body as Budget;
      const budget: Budget = await this.repository.create_budget(
        budgetInterface
      );
      res.send(budget);
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  create_budget_company: RequestHandler = async (req, res) => {
    try {
      const { budget_companies } = req.body as { budget_companies: Budget_company[] };

      await Promise.all(budget_companies.map(async (budgetProductData) => {

        const createdBudgetProduct = await this.repository.create_budget_company(budgetProductData);

        res.send({ message: "Orçamento criado com sucesso", createdBudgetProduct });
      }));
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  create_budget_product: RequestHandler = async (req, res) => {
    try {

      const { budget_products } = req.body as { budget_products: Budget_product[] };

      await Promise.all(budget_products.map(async (budgetProductData) => {

        const createdBudgetProduct = await this.repository.create_budget_product(budgetProductData);

        res.send({ message: "Orçamento criado com sucesso", createdBudgetProduct });
      }));

    } catch (error) {
      res.status(500).send({ error });
    }
  };

  print_budget: RequestHandler = async (req, res) => {
    try {
      const id: number = parseInt((req.params as { id: string }).id);
      const budget: Budget = await this.repository.budgetDetails(id);


      if (budget) {
        const dataBudget = {
          name: budget.name,
          responsible_name: budget.responsible_name,
          rg: budget.rg,
          cpf: budget.cpf,
          createdAt: budget.createdAt
        };


        const data = dataBudget.createdAt
        const date = new Date(data);
        const formattedDate = new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);

        const imagePath = 'image/creche.jpg';
        const imageBase64 = fs.readFileSync(path.resolve(imagePath), 'base64');

        let texto = `

            <h4 style="color: gray; text-align: center; margin-top: 50px "> ESTOQUE ADMIN </h4>
            <p style="font-weight: bold; text-align: center ">CONSOLIDAÇÃO DE PESQUISAS DE PREÇOS</p>
            <p  style=" margin-left: 50px ">EXERCÍCIO: 2024</p>
            <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto ">
              <tr>
                <th colspan="2" style="border: 1px solid black; padding: 8px; text-align: center;"
                  >I – IDENTIFICAÇÃO DOS PROPONENTES (Fornecedores de Produtos)
                </th>
                
              </tr>
          `;


        const budgetCompanies: Budget_company[] = await this.repository.findCompaniesByBudgetId(budget.id);

        const budgetPrices: Budget_product[] = await this.repository.findProductsByBudgetId(budget.id);


        budgetCompanies.forEach((company, index) => {
          const dataCompany = {
            razaoSocial: company.razao_social,
            cnpj: company.cnpj,
            telefone: company.telefone,
          };

          let letra = String.fromCharCode(66 + index - 1);

          texto +=
            `
              <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left; width: 130px ">
                  PROPOENTE (${letra})
                </td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">
                  Razão Social: ${dataCompany.razaoSocial}<br> CNPJ: ${dataCompany.cnpj}<br> Telefone: ${dataCompany.telefone}
                </td>
              </tr>
  
          `
        });

        texto += `
         </table>
         <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto; margin-top: 30px ">
          <tr>
            <th colspan="6" style="border: 1px solid black; padding: 8px; text-align: center;">
              II – PROPOSTAS (R$)
            </th>
          </tr>
          <tr>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Item
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Descrição dos Produtos e Serviços
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Unid.
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (A)
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (B)
            </th>
            <th style="border: 1px solid black; padding: 8px; text-align: center;">
              Valor Prop. (C)
            </th>
          </tr>
        `

        //Iniciano as variaveis
        let totalA = 0
        let totalB = 0
        let totalC = 0
        let resultado

        budgetPrices.forEach((price, index) => {
          const dataPrice = {
            descricao: price.descricao,
            unidade: price.unidade,
            valorA: price.valorA,
            valorB: price.valorB,
            valorC: price.valorC,
          };



          texto += `
            <tr>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${index + 1}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.descricao}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.unidade}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorA}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorB}
              </td>
              <td style="border: 1px solid black; padding: 8px; text-align: center;">
                ${dataPrice.valorC}
              </td>
            </tr>
          `

          totalA += dataPrice.unidade * dataPrice.valorA
          totalB += dataPrice.unidade * dataPrice.valorB
          totalC += dataPrice.unidade * dataPrice.valorC


        });

        if (totalA < totalB && totalA < totalC) {
          resultado = "A"
        }

        if (totalB < totalA && totalB < totalC) {
          resultado = "B"
        }

        if (totalC < totalB && totalC < totalA) {
          resultado = "C"
        }

        texto +=
          `
            <tr>
              <td colspan="3" style="border: 1px solid black; padding: 8px; text-align: center;"> Valor Total da Proposta </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalA} </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalB} </td>
              <td  style="border: 1px solid black; padding: 8px; text-align: center;"> R$ ${totalC} </td>
            </tr>
          </table>
          <table style="border-collapse: collapse; width: 90%; margin-left: auto; margin-right: auto; text-align: center; margin-top: 30px ">
            <tr>
              <th  style="border: 1px solid black; padding: 8px; text-align: center;"> III- OBSERVAÇÕES/JUSTIFICATIVAS </th>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 8px; text-align: center;"> Realizado Orçamento nas três empresas a Proponente (A), (B) e (C). Optamos pela Prononente ${resultado}
                por apresentar o menor valor.
              </td>
            </tr>
          </table>

          <p style="border: 1px solid black; width: 90%; text-align: center; margin-left: auto; margin-right: auto;"> IV- AUTENTICAÇÃO </p>
          <p style="margin-left: 50px ; "> Local e Data: Franca, de ${formattedDate} </p>
          <p style="margin-left: 50px ; "> Nome do Responsável: ${budget.responsible_name} - R.G:  ${budget.rg} - CPF:  ${budget.cpf} </p>
          <p style="margin-left: 50px ; "> Assinatura: ______________________________________________________________________ </p>
        `
        res.send(texto);
      };
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
