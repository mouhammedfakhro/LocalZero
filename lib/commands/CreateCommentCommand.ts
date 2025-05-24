import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface CreateCommentInput {
  eventId: number;
  userId: number;
  content: string;
}

export class CreateCommentCommand implements ICommand {
  constructor(private readonly input: CreateCommentInput) {}

  async execute() {
    const { eventId, userId, content } = this.input;

    if (!eventId || !userId || !content?.trim()) {
      throw new Error("Missing required fields: eventId, userId, or content.");
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        event: {
          connect: { id: eventId },
        },
        author: {
          connect: { id: userId },
        },
      },
    });

    return newComment;
  }
}
