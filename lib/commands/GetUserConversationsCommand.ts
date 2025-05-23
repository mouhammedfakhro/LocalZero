import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetUserConversationsCommand implements ICommand {
  constructor(private readonly userId: number) {}

  async execute() {
    if (isNaN(this.userId)) {
      throw new Error("Invalid user ID.");
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: this.userId },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return conversations;
  }
}
