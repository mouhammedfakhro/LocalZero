import { NextRequest, NextResponse } from "next/server";
import { GetNotificationsCommand } from "../../../../lib/commands/GetNotificationsCommand";
import { CreateNotificationCommand } from "../../../../lib/commands/CreateNotificationCommand";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const read = searchParams.get("read") === "true";
    const sidebar = searchParams.get("sidebar") === "true";

    const command = new GetNotificationsCommand({ userId, read, sidebar });
    const notifications = await command.execute();

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Error fetching notifications:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const command = new CreateNotificationCommand(body);
    const notification = await command.execute();

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error("Error creating notification:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
