import bcrypt from "bcrypt";
import prisma from "../../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, email, password, role } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const neighborhood = await prisma.neighborhood.findFirst({
      where: { name: location },
    });

    if (!neighborhood) {
      return NextResponse.json("No neighborhood found.")
    }

    const user = await prisma.user.create({
      data: {
        username: name,
        password: hashedPassword,
        email: email,
        role: role,
        neighborhoodId: neighborhood.id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
