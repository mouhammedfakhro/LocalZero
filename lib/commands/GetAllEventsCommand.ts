import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetAllEventsCommand implements ICommand {
  async execute() {
    const events = await prisma.event.findMany({
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
        participations: true,
        creator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  }
}
