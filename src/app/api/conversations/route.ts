import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";


export async function POST(req: NextResponse) {
  try {
    const body = await req.json();
    const { senderId, recipientUsername, message } = body;

    if (!senderId || !recipientUsername || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recipient = await prisma.user.findFirst({
      where: { username: recipientUsername },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // 2. Create a conversation with both users as participants
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: senderId }, { id: recipient.id }],
        },
      },
    });

    // 3. Create the first message
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId: recipient.id,
        message,
        conversationId: conversation.id,
      },
    });

    return NextResponse.json({
      message: "Conversation created successfully",
      conversationId: conversation.id,
      initialMessage: newMessage,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const userId = 1; // Replace with session-based user ID if available

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: {
        updatedAt: "desc",  
      },
    });

    console.log(conversations);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
