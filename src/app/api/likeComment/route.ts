import { NextResponse } from "next/server";
import { ToggleCommentLikeCommand } from "../../../../lib/commands/ToggleCommentLikeCommand";

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const commentId = searchParams.get("commentId");

    const numericUserId = Number(userId);
    const numericCommentId = Number(commentId);

    const command = new ToggleCommentLikeCommand({
      userId: numericUserId,
      commentId: numericCommentId,
    });

    const updatedComment = await command.execute();

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    console.error("Error toggling like:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to toggle like" },
      { status: 400 }
    );
  }
}
