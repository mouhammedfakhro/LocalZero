import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    const user = prisma.user.findUnique({
      where: {
        id: Number(userIdParam),
      },
    });

    if (!user) {
      return NextResponse.json("No user found.");
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json("Failed to fetch user.");
  }
}
