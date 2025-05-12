import { NextResponse } from "next/server";
import {JoinEventCommand} from '../../../../core/commands/JoinEventCommand';

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split("/").slice(-2, -1)[0]; 

  if (!id) {
    return NextResponse.json({ error: "No event ID provided" }, { status: 400 });
  }

  try {
    const command = new JoinEventCommand(parseInt(id));
    const event = await command.execute();

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400 });
  }
}