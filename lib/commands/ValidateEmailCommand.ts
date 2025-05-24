import prisma from "../prisma";
import { ICommand } from "./ICommand";

interface ValidateEmailInput {
  email: string;
}

export class ValidateEmailCommand implements ICommand {
  constructor(private readonly input: ValidateEmailInput) {}

  async execute() {
    const { email } = this.input;

    if (!email || typeof email !== "string") {
      throw new Error("Invalid email provided.");
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    return { isValid: !existingUser };
  }
}
