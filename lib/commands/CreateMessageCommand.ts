import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreateMessageDTO {
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
}

export class CreateMessageCommand implements ICommand {
  constructor(private readonly data: CreateMessageDTO) {}

  async execute() {
    const conversation = await prisma.conversation.findUnique({
      where: { id: this.data.conversationId },
      include: { messages: true },
    });

    if (!conversation) throw new Error("Conversation not found");

    const message = await prisma.message.create({
      data: {
        conversationId: this.data.conversationId,
        senderId: this.data.senderId,
        receiverId: this.data.receiverId,
        message: this.data.content,
      },
    });

    return message;
  }
}