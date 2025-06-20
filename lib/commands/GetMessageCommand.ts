import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetMessagesCommand implements ICommand {
  constructor(
    private readonly conversationId: number,
  ) {}

  async execute() {
    const messages = await prisma.message.findMany({
      where: { conversationId: this.conversationId },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  }
}
