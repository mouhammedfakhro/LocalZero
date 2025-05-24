import { NextRequest, NextResponse } from "next/server";
import { JoinEventCommand } from "../../../../lib/commands/JoinEventCommand";

export async function PUT(req: NextRequest) {
  console.log("Request received at /api/joinEvent");

  try {
    const body = await req.json();
    const command = new JoinEventCommand(body);
    const updatedEvent = await command.execute();

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error("Error updating event:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update event" },
      { status: 400 }
    );
  }
}
