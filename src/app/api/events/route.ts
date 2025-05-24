import { NextResponse } from "next/server";
import { GetEventDetailsCommand } from "../../../../lib/commands/GetEventDetailsCommand";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventIdParam = searchParams.get("eventID");
    const eventId = Number(eventIdParam);

    const command = new GetEventDetailsCommand(eventId);
    const event = await command.execute();

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("Error fetching event:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch event." },
      { status: 400 }
    );
  }
}
