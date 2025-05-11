import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("location") || "";
    console.log(name);

    const neighborhood = await prisma.neighborhood.findFirst({
      where: {
        name: name,
      },
    });

    if (neighborhood) {
      return NextResponse.json({ isValid: true }, { status: 201 });
    }

    return NextResponse.json({ isValid: false }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ isValid: false, error: true, status: 401 });
  }
}
