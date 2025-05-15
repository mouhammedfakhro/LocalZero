import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import {CreateEventCommand} from '../../../core/commands/CreateEventCommand';
import { CommandInvoker } from "../../../core/commands/CommandInvoker";

export async function POST(request: Request) {
    try {
        const eventData = await request.json();
        const createEventCommand = new CreateEventCommand(prisma,eventData );
        const commandInvoker = new CommandInvoker();

        const createdEvent = await commandInvoker.execute(createEventCommand);
        return NextResponse.json(createdEvent, { status: 201 });
    }
    catch (error) {
        console.error("Error creating event:", error);
        if (error instanceof Error && error.message === "Event already exists") {
            return NextResponse.json({ message: "Event already exists" }, { status: 409 });
        }
    }
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
}
