import { NextRequest, NextResponse } from "next/server";
import { CreatePostUpdateCommand } from "../../../../lib/commands/CreatePostUpdateCommand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command = new CreatePostUpdateCommand(body);
    const newUpdate = await command.execute();

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post update:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
