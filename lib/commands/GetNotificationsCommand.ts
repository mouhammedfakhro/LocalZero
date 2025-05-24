import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface GetNotificationsInput {
  userId: number;
  read?: boolean;
  sidebar?: boolean;
}

export class GetNotificationsCommand implements ICommand {
  constructor(private readonly input: GetNotificationsInput) {}

  async execute() {
    const { userId, read, sidebar } = this.input;

    if (!userId || isNaN(userId)) {
      throw new Error("Missing or invalid userId.");
    }

    const whereClause: any = {
      userId: userId,
    };

    if (sidebar === true) {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    if (read === true) {
      await prisma.notification.updateMany({
        where: { userId },
        data: {
          isRead: true,
        },
      });
    }

    return notifications;
  }
}
