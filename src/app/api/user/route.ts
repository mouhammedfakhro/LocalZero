import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const neighborhood = await prisma.neighborhood.findFirst({
      where: { id: 1 },
    });

    if (neighborhood) {
      const user = await prisma.user.create({
        data: {
          username: "mockuser",
          password: "mockhashedpassword",
          email: "mockuser@example.com",
          role: Role.RESIDENT,
          neighborhoodId: neighborhood.id,
        },
      });

      return NextResponse.json(user, { status: 201 });
    }
  } catch {

    return NextResponse.json("Failed", { status: 201 });

  }

}
