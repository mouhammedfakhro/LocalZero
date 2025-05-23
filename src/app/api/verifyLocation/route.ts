import { NextRequest, NextResponse } from "next/server";
import { ValidateNeighborhoodCommand } from "../../../../lib/commands/ValidateNeighborhoodCommand";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("location") || "";

    const command = new ValidateNeighborhoodCommand({ name });
    const result = await command.execute();

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Location validation error:", error.message);
    return NextResponse.json(
      { isValid: false, error: true },
      { status: 401 }
    );
  }
}
