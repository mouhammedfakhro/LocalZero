import { NextRequest, NextResponse } from "next/server";
import { RegisterUserCommand } from "../../../../../lib/commands/RegisterUserCommand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = new RegisterUserCommand(body);
    const user = await command.execute();

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}
