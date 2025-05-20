import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        comments: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            author: true,
            likedBy: true,
          }
        },
        updates: {
          orderBy: {
            createdAt: "desc",
          }
        },
        participations: true,
        creator: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
