import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import nodemailer from 'nodemailer';

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class UserController {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const users: User[] = await this.repository.findAll();
      res.send(users);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  create: RequestHandler = async (req, res) => {
    try {
      const userInterface: User = req.body as User;
      const user: User = await this.repository.create(userInterface);
      res.send(user);
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const userInterface: User = req.body as User;
      const params = req.params as { id: string };

      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }

      const userId = Number(params.id);
      const user: User | null = await this.repository.update(userId, userInterface);

      if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      res.send(user);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  delete: RequestHandler = async (req, res) => {
    try {
      const params = req.params as { id: string };

      if (typeof params.id !== "string") {
        res.status(400).send({ error: "Invalid id" });
        return;
      }

      const userId = Number(params.id);
      const deleted: boolean = await this.repository.delete(userId);

      if (!deleted) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      res.code(204).send();
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const user = await this.repository.login(email);

      if (!user) {
        res.status(404).send("Usuário não encontrado");
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(406).send("Credenciais incorretas");
        return;
      }

      const token = jwt.sign(
        { email: user.email, isAdmin: user.is_admin },
        process.env.TOKEN_SECRET
      );

      res.status(200).send({ token: token });
    } catch (error) {
      res.status(500).send("Erro interno no servidor");
      console.log(error)
    }
  };

  recorverPassword: RequestHandler = async (req, res) => {
    try {
      const { email, } = req.body as { email: string };
      const token = crypto.randomBytes(10).toString("hex")
      const expiresIn = new Date()
      expiresIn.setHours(expiresIn.getHours() + 1);
      const user = await this.repository.recoverPassword(email, token, false, expiresIn);

      if (!user) {
        res.status(404).send("Email incorreto");
        return;
      }
      const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'igorpcampos2004@gmail.com',
          pass: 'btdlktpkigrntpkk'
        }
      })

      transport.sendMail({
        from: 'Projeto TIC <igorpcampos2004@gmail.com>',
        to: `${email}`,
        subject: 'Enviando email de recuperação de senha',
        html: `<h1>Olá, copie esse código ${token} para redefinir sua senha</h1> <br> Entre<a href="http://localhost:1234/admin/user/changepassword"> aqui </a> é pegue o codigo e sua nova senha`,
        text: `<h1>Olá, copie esse código ${token} para redefinir sua senha</h1> <br> Entre<a href=""> aqui </a> é pegue o codigo e sua nova senha`
      }).then(() => console.log("Email enviado com sucesso"))
        .catch((err) => console.log(`Erro ao enviar email ${err}`))

      res.status(200).send({ token })
    } catch (error) {
      res.status(500).send("Erro interno no servidor");
      console.log(error)
    }
  };
  
  changePassword: RequestHandler = async (req, res) => {
    try {
      let token = req.body as {token: string}
      const password  = req.body as {password: string }
      const now = new Date()

      const isTokenValid = await this.repository.changePassword(token.token);

      let status = false
      if (isTokenValid == undefined && now > isTokenValid.expiresIn && isTokenValid.used) {
        status = false
      } else {
        status = true
        token.token = isTokenValid.token
      }

      if (status) {
        const id = isTokenValid.id
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password.password, salt);
        await this.repository.updateToken(id, hash, true)
        res.status(200).send("Senha alterada");
      } else {
        res.status(406).send("Token inválido!");
      }
    } catch (error) {
      res.status(500).send("Erro interno no servidor");
      console.log(error)
    }
  }
}