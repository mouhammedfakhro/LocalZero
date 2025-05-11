import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const neighborhoods = await prisma.neighborhood.findMany();

  return NextResponse.json(neighborhoods);
}
