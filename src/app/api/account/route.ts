import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const password = "123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: "user",
        password: hashedPassword,
        email: "mockuser@example.com",
        role: "ORGANIZER",
        neighborhoodId: 1,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json("user");
  }
}
