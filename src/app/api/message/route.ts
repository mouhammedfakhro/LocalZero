import { NextRequest, NextResponse } from "next/server";
import { CreateMessageCommand } from "../../../../lib/commands/CreateMessageCommand";
import { GetMessagesCommand } from "../../../../lib/commands/GetMessageCommand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = new CreateMessageCommand({
      conversationId: body.conversationId,
      senderId: Number(body.senderId),
      receiverId: body.receiverId,
      content: body.content,
    });

    const message = await command.execute();
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const userId = searchParams.get("userId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing conversationId" },
      { status: 400 }
    );
  }

  try {
    const command = new GetMessagesCommand(Number(conversationId));
    const messages = await command.execute();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
