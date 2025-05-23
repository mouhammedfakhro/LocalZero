import { NextRequest, NextResponse } from "next/server";
import { LoginUserCommand } from "../../../../../lib/commands/LoginUserCommand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = new LoginUserCommand(body);
    const token = await command.execute();

    return NextResponse.json(token);
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
