import { NextResponse } from "next/server";
import { GetAllNeighborhoodsCommand } from "../../../../lib/commands/GetAllNeighborhoodsCommand";

export async function GET() {
  try {
    const command = new GetAllNeighborhoodsCommand();
    const neighborhoods = await command.execute();

    return NextResponse.json(neighborhoods);
  } catch (error: any) {
    console.error("Error fetching neighborhoods:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch neighborhoods" },
      { status: 500 }
    );
  }
}
