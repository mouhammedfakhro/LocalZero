import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    return NextResponse.json(await prisma.user.findMany());
  } catch (error) {
    return NextResponse.json("Failed to find users.");
  }
}
