import prisma from "../prisma";
import { ICommand } from "./ICommand";
import { Action } from "@prisma/client";

const carbonSavingsByType: Record<string, number> = {
  BIKE: 2.5,
  WALK: 2.8,
  BUS: 1.2,
  ELECTRIC_CAR: 0.5,
};

interface CreateEcoActionInput {
  userId: number;
  title: string;
  description?: string;
  type: string;
}

export class CreateEcoActionCommand implements ICommand {
  constructor(private readonly input: CreateEcoActionInput) {}

  async execute() {
    const { userId, title, description, type } = this.input;

    if (!title || !type || !userId) {
      throw new Error("Missing required fields: title, type, or userId.");
    }

    const carbonSavedKg = carbonSavingsByType[type];

    if (carbonSavedKg === undefined) {
      throw new Error("Invalid action type.");
    }

    const savedAction = await prisma.ecoAction.create({
      data: {
        title,
        description,
        action: type as Action,
        carbonSaved: carbonSavedKg,
        user: {
          connect: { id: userId },
        },
      },
    });

    return savedAction;
  }
}
