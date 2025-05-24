import { NextRequest, NextResponse } from "next/server";
import { CreateCommentCommand } from "../../../../lib/commands/CreateCommentCommand";

export async function POST(req: NextRequest) {
  console.log("Request received at /api/comment");

  try {
    const body = await req.json();
    console.log("Event ID:", body.eventId, "User ID:", body.userId, "Content:", body.content);

    const command = new CreateCommentCommand(body);
    const comment = await command.execute();

    console.log("New comment created:", comment);
    return NextResponse.json(comment);
  } catch (error: any) {
    console.error("Error creating comment:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create comment" },
      { status: 400 }
    );
  }
}
