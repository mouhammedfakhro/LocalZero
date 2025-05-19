import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    const messages = await prisma.message.findMany({
      where: {
        receiverId: Number(userIdParam),
        read: false,
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json("Failed to fetch unread messages.");
  }
}
