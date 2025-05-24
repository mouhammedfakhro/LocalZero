import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface ToggleCommentLikeInput {
  userId: number;
  commentId: number;
}

export class ToggleCommentLikeCommand implements ICommand {
  constructor(private readonly input: ToggleCommentLikeInput) {}

  async execute() {
    const { userId, commentId } = this.input;

    if (!userId || !commentId) {
      throw new Error("Missing userId or commentId.");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { likedBy: true },
    });

    if (!comment) {
      throw new Error("Comment not found.");
    }

    const alreadyLiked = comment.likedBy.some((user) => user.id === userId);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: {
          [alreadyLiked ? "disconnect" : "connect"]: {
            id: userId,
          },
        },
      },
      include: {
        likedBy: true,
      },
    });

    return updatedComment;
  }
}
