import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, content, username } = body;

    if (!eventId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: eventId or content" },
        { status: 400 }
      );
    }

    const newUpdate = await prisma.postUpdate.create({
      data: {
        content,
        username: username,
        event: {
          connect: { id: eventId },
        },
      },
    });

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating post update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
