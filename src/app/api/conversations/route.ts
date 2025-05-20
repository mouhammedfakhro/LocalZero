import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderId, recipientUsername, message } = body;

    if (!senderId || !recipientUsername || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const recipient = await prisma.user.findFirst({
      where: { username: recipientUsername },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    const sender = await prisma.user.findFirst({
      where: { id: Number(senderId) },
    });

    console.log("-------------");
    console.log(sender);
    console.log("-------------");

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: Number(senderId) }, { id: recipient.id }],
        },
      },
    });

    const newMessage = await prisma.message.create({
      data: {
        senderId: Number(senderId),
        receiverId: recipient.id,
        message: message,
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

export async function GET(req: NextRequest) {
  try {
    console.log("Full request URL:", req.url); 

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("currentUserId");

    console.log("userId:", userIdParam); 


    if (!userIdParam) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

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

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
