import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const commentId = searchParams.get("commentId");

    if (!userId || !commentId) {
      return NextResponse.json(
        { error: "Missing userId or commentId" },
        { status: 400 }
      );
    }

    const numericUserId = Number(userId);
    const numericCommentId = Number(commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: numericCommentId },
      include: {
        likedBy: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = comment.likedBy.some((user) => user.id === numericUserId);

    const updatedComment = await prisma.comment.update({
      where: { id: numericCommentId },
      data: {
        likedBy: {
          [alreadyLiked ? "disconnect" : "connect"]: {
            id: numericUserId,
          },
        },
      },
      include: {
        likedBy: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
