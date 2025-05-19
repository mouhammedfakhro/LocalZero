import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { Action } from "@prisma/client";

const carbonSavingsByType: Record<string, number> = {
  BIKE: 2.5,
  WALK: 2.8,
  BUS: 1.2,
  ELECTRIC_CAR: 0.5,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, description, type } = body;

    if (!title || !type || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: title and type." },
        { status: 400 }
      );
    }

    const carbonSavedKg = carbonSavingsByType[type];

    if (carbonSavedKg === undefined) {
      return NextResponse.json(
        { error: "Invalid type provided." },
        { status: 400 }
      );
    }

    const savedAction = await prisma.ecoAction.create({
      data: {
        title,
        description,
        action: type as Action,
        carbonSaved: carbonSavedKg,
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Action logged successfully.",
      data: savedAction,
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Invalid JSON or server error." },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json({ error: "No user id found." }, { status: 400 });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    const data = await prisma.ecoAction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/action error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

