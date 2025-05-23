import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetEventDetailsCommand implements ICommand {
  constructor(private readonly eventId: number) {}

  async execute() {
    if (!this.eventId || isNaN(this.eventId)) {
      throw new Error("Missing or invalid eventId.");
    }

    const event = await prisma.event.findUnique({
      where: { id: this.eventId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: true,
            likedBy: true,
          },
        },
        updates: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found.");
    }

    return event;
  }
}
