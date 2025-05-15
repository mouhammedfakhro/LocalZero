import { Command } from "./Command";
import { PrismaClient } from "@prisma/client/extension";

export class CreateEventCommand implements Command<any> {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly eventData: {
            title : string;
            location : string;
            category : string;
            isPublic : boolean;
            creatorId: number;
        }
    ){}
    async execute() : Promise<any> {
        if(!this.eventData.title || !this.eventData.location || !this.eventData.category || this.eventData.isPublic === undefined || !this.eventData.creatorId) {
            throw new Error("Data error ! ");
        }
        return await this.prisma.event.create({
            data: {
                title : this.eventData.title,
                location : this.eventData.location, 
                category : this.eventData.category,
                isPublic : this.eventData.isPublic !== undefined ? this.eventData.isPublic : false,
                creatorId : this.eventData.creatorId, 
            }
    });
}
}