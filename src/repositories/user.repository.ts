import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(data: User): Promise<User> {
    const { email, password, ...userData } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
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
}
