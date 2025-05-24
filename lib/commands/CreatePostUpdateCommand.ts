import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreatePostUpdateInput {
  eventId: number;
  content: string;
  username?: string;
}

export class CreatePostUpdateCommand implements ICommand {
  constructor(private readonly input: CreatePostUpdateInput) {}

  async execute() {
    const { eventId, content, username } = this.input;

    if (!eventId || !content?.trim()) {
      throw new Error("Missing required fields: eventId or content.");
    }

    const newUpdate = await prisma.postUpdate.create({
      data: {
        content,
        username,
        event: {
          connect: { id: eventId },
        },
      },
    });

    return newUpdate;
  }
}
