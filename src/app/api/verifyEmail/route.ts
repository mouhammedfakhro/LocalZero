import { NextRequest, NextResponse } from "next/server";
import { ValidateEmailCommand } from "../../../../lib/commands/ValidateEmailCommand";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "";

    const command = new ValidateEmailCommand({ email });
    const result = await command.execute();

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Email validation error:", error.message);
    return NextResponse.json(
      { isValid: false, error: true },
      { status: 401 }
    );
  }
}
