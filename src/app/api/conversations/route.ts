import { NextRequest, NextResponse } from "next/server";
import { CreateConversationCommand } from "../../../../lib/commands/CreateConversationCommand";
import { GetUserConversationsCommand } from "../../../../lib/commands/GetUserConversationsCommand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = new CreateConversationCommand(body);
    const result = await command.execute();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error creating conversation:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("currentUserId");

    if (!userIdParam) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userId = parseInt(userIdParam);
    const command = new GetUserConversationsCommand(userId);
    const conversations = await command.execute();

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error("GET /api/conversations error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
