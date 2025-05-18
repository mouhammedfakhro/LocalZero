import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log("Request received at /api/comment");
  const body = await req.json();

  const { eventId, userId, content } = body;
  console.log("Event ID:", eventId, "User ID:", userId, "Content:", content);
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        event: {
          connect: { id: eventId },
        },
        author: {
          connect: { id: userId },
        },
      },
    });
    console.log("New comment created:", newComment);
    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
