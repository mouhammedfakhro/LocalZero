import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventIdParam = searchParams.get("eventID");

  const eventId = Number(eventIdParam);

  if (!eventIdParam || isNaN(eventId)) {
    return NextResponse.json(
      { error: "Missing or invalid eventId" },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      comments: {
        orderBy: {
            createdAt: "desc",
        },
        include: {
          author: true,
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json(event);
}
