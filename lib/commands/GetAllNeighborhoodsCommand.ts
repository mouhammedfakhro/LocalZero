import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetAllNeighborhoodsCommand implements ICommand {
  async execute() {
    const neighborhoods = await prisma.neighborhood.findMany();
    return neighborhoods;
  }
}
