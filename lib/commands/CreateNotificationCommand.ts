import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreateNotificationInput {
  userId: number;
  content: string;
}

export class CreateNotificationCommand implements ICommand {
  constructor(private readonly input: CreateNotificationInput) {}

  async execute() {
    const { userId, content } = this.input;

    if (!userId || !content) {
      throw new Error("Missing userId or content.");
    }

    const notification = await prisma.notification.create({
      data: {
        userId: Number(userId),
        content,
      },
    });

    return notification;
  }
}
