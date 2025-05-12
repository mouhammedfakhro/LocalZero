import { Command} from "./Command";
import prisma from "../../../../lib/prisma";

export class JoinEventCommand implements Command<any> {
    private eventID: number;

    constructor(eventID:number){
        this.eventID = eventID;
    }
    public async execute(): Promise<any> {
        try{
            const event = await prisma.event.update({
                where : { id: this.eventID },
                data : {
                    participants: {
                        connect: {
                            id: this.eventID // lägg rätt id här
                        }
                    }
                }
            });
            return event;
        } catch (error) {
            console.error("Error joining event:", error);
            throw new Error("Failed to join event");
        }
    }
}