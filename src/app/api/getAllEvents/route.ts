import { NextResponse } from "next/server";
import { GetAllEventsCommand } from "../../../../lib/commands/GetAllEventsCommand";

export async function GET() {
  try {
    const command = new GetAllEventsCommand();
    const events = await command.execute();

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error fetching events:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}
