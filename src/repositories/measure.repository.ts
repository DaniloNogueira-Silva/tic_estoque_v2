import { PrismaClient, Unit_Measure } from "@prisma/client";

const prisma = new PrismaClient();

export class MeasureRepository {
  async findAll(): Promise<Unit_Measure[]> {
    return prisma.unit_Measure.findMany();
  }

  async create(data: Unit_Measure): Promise<Unit_Measure> {
    const { ...unit_measureData } = data;

    const unit_measure = await prisma.unit_Measure.create({
      data: {
        ...unit_measureData,
      },
    });

    return unit_measure;
  }
}
