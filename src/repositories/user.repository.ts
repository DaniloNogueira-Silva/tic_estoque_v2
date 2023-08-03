import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(data: User): Promise<User> {
    const { email, password, ...userData } = data;

    // Verifica se já existe um usuário com o mesmo email no banco
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const saltRounds = 10;
    // Gera o hash da senha usando bcrypt com um salt de 10 rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Cria o usuário no banco com a senha hasheada
    const user = await prisma.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword, // Aqui a senha hasheada é armazenada no banco
      },
    });

    return user;
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await prisma.user.delete({
      where: { id },
    });
    return deleteResult !== null;
  }

  async update(id: number, data: User): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async login(email: string): Promise<User | null> {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }
    return user;
  }

  async recoverPassword(email: string, token: string, used: boolean, expiresIn: Date): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    await prisma.user.update({
      where: { email },
      data: {
        token: token,
        expiresIn: expiresIn,
        used: used,
      },
    });

    return user;
  }


  async changePassword(token: string): Promise<User | null> {
    let isTokenValid = await prisma.user.findFirstOrThrow({
      where: { token },
    });

    if (!isTokenValid) {
      return null;
    }
    return isTokenValid;

  }

  async updateToken(id: number, password: string, used: boolean): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: password,
        used: used,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
