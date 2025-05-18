import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PUT(req: NextRequest) {
  console.log("Request received at /api/joinEvent");
  const body = await req.json();

  const { eventId, userId } = body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        participations: {
          connect: { id: userId },
        },
      },
      include: {
        participations: true,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
