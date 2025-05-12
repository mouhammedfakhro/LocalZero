import { Command } from "./Command";
import prisma from "../../../../lib/prisma";

export class GetAllEventsCommand implements Command<any>{
    public async execute() : Promise<any> {
        return await prisma.event.findMany();
    }
}