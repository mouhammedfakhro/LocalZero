import { NextResponse } from "next/server";
import { CreateEventCommand } from "../../../../lib/commands/CreateEventCommand";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const command = new CreateEventCommand(body);
    const event = await command.execute();

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("Error creating event:", error.message);
    return NextResponse.json(
      { error: error.message || "Error creating event" },
      { status: 500 }
    );
  }
}
