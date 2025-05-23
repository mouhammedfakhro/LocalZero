import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreateConversationInput {
  senderId: number;
  recipientUsername: string;
  message: string;
}

export class CreateConversationCommand implements ICommand {
  constructor(private readonly input: CreateConversationInput) {}

  async execute() {
    const { senderId, recipientUsername, message } = this.input;

    if (!senderId || !recipientUsername || !message?.trim()) {
      throw new Error("Missing required fields.");
    }

    const recipient = await prisma.user.findFirst({
      where: { username: recipientUsername },
    });

    if (!recipient) {
      throw new Error("Recipient not found.");
    }

    const sender = await prisma.user.findFirst({
      where: { id: senderId },
    });

    if (!sender) {
      throw new Error("Sender not found.");
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: senderId }, { id: recipient.id }],
        },
      },
    });

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId: recipient.id,
        message,
        conversationId: conversation.id,
      },
    });

    return {
      message: "Conversation created successfully",
      conversationId: conversation.id,
      initialMessage: newMessage,
    };
  }
}
