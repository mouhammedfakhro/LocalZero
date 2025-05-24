import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetEcoActionsCommand implements ICommand {
  constructor(private readonly userId: number) {}

  async execute() {
    if (isNaN(this.userId)) {
      throw new Error("Invalid user id.");
    }

    const actions = await prisma.ecoAction.findMany({
      where: { userId: this.userId },
      orderBy: { createdAt: "desc" },
    });

    return actions;
  }
}
