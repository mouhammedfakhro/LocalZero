import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, locationId, email, password, isOrganizer } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: isOrganizer ? "ORGANIZER" : "RESIDENT",
        neighborhoodId: locationId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
