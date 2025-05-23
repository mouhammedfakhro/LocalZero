import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreateEventInput {
  title: string;
  location: string;
  description?: string;
  isPublic: boolean;
  startDate?: string;
  endDate?: string;
  userId: number;
}

export class CreateEventCommand implements ICommand {
  constructor(private readonly input: CreateEventInput) {}

  async execute() {
    const {
      title,
      location,
      description,
      isPublic,
      startDate,
      endDate,
      userId,
    } = this.input;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { neighborhood: true },
    });

    if (!user) {
      throw new Error("User not found. Event not created.");
    }

    const event = await prisma.event.create({
      data: {
        title,
        location,
        description,
        isPublic,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        creator: {
          connect: { id: userId },
        },
      },
    });

    if (event) {
      const users = await prisma.user.findMany({
        where: {
          id: { not: user.id },
          neighborhood: {
            name: event.location,
          },
        },
        select: { id: true, neighborhood: { select: { name: true } } },
      });

      const notifications = users.map((u) => ({
        userId: u.id,
        content: `New initiative created in ${location}`,
      }));

      await prisma.notification.createMany({ data: notifications });
    }

    return event;
  }
}
