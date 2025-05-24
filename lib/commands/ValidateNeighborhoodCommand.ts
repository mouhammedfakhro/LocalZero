import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface ValidateNeighborhoodInput {
  name: string;
}

export class ValidateNeighborhoodCommand implements ICommand {
  constructor(private readonly input: ValidateNeighborhoodInput) {}

  async execute() {
    const { name } = this.input;

    if (!name || typeof name !== "string") {
      throw new Error("Invalid neighborhood name.");
    }

    const neighborhood = await prisma.neighborhood.findFirst({
      where: { name },
    });

    return { isValid: !!neighborhood };
  }
}
