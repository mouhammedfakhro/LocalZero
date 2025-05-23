import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface JoinEventInput {
  eventId: number;
  userId: number;
}

export class JoinEventCommand implements ICommand {
  constructor(private readonly input: JoinEventInput) {}

  async execute() {
    const { eventId, userId } = this.input;

    if (!eventId || !userId) {
      throw new Error("Missing eventId or userId.");
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        participations: {
          connect: { id: userId },
        },
      },
      include: {
        participations: true,
      },
    });

    return updatedEvent;
  }
}
