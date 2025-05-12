import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { GetAllNeighbourhoodsCommand} from "../../core/commands/GetAllNeighbourhoodsCommand";


export async function GET() {
  const command = new GetAllNeighbourhoodsCommand();
  const neighborhoods = await prisma.neighborhood.findMany();

  return NextResponse.json(neighborhoods);
}
