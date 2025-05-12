import { Command } from "./Command";
import prisma from "../../../../lib/prisma";

export class GetAllNeighbourhoodsCommand implements Command<any[]> {
    public async execute(): Promise<any[]> {
        return await prisma.neighborhood.findMany();
    }
}