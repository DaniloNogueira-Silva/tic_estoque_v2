import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      res.status(500).send({ error: "Internal server error" });
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
}