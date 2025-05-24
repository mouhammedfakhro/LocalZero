import { NextResponse } from "next/server";
import { GetAllUsersCommand } from "../../../../lib/commands/GetAllUsersCommand";

export async function GET() {
  try {
    const command = new GetAllUsersCommand();
    const users = await command.execute();

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Failed to find users:", error.message);
    return NextResponse.json({ error: error.message || "Failed to find users" }, { status: 500 });
  }
}
