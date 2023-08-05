import { FastifyRequest, FastifyReply } from "fastify";
import { MeasureRepository } from "../../repositories/measure.repository";
import { Unit_Measure } from "@prisma/client";

type MyRequest = FastifyRequest;
type MyReply = FastifyReply;

type RequestHandler = (req: MyRequest, res: MyReply) => Promise<void>;

export class MeasureController {
  repository: MeasureRepository;

  constructor(repository: MeasureRepository) {
    this.repository = repository;
  }

  index: RequestHandler = async (req, res) => {
    try {
      const unit_measures: Unit_Measure[] = await this.repository.findAll();
      res.send(unit_measures);
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  };

  create: RequestHandler = async (req, res) => {
    try {
      const unit_measureInterface: Unit_Measure = req.body as Unit_Measure;
      const unit_measure: Unit_Measure = await this.repository.create(unit_measureInterface);
      res.send(unit_measure);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
}