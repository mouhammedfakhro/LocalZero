import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { GetAllEventsCommand} from "../../core/commands/GetAllEventsCommand";

export async function GET() {
  const command = new GetAllEventsCommand();
  const events = await command.execute();

  return NextResponse.json(events);
}



