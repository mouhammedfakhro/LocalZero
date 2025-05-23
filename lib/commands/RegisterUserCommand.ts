import bcrypt from "bcrypt";
import prisma from "../prisma";
import { ICommand } from "./ICommand";
import { Role } from "@prisma/client";

interface RegisterUserInput {
  name: string;
  location: string;
  email: string;
  password: string;
  role: Role;
}

export class RegisterUserCommand implements ICommand {
  constructor(private readonly input: RegisterUserInput) {}

  async execute() {
    const { name, location, email, password, role } = this.input;

    if (!name || !location || !email || !password || !role) {
      throw new Error("All fields are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const neighborhood = await prisma.neighborhood.findFirst({
      where: { name: location },
    });

    if (!neighborhood) {
      throw new Error("No neighborhood found.");
    }

    const user = await prisma.user.create({
      data: {
        username: name,
        password: hashedPassword,
        email: email,
        role: role,
        neighborhoodId: neighborhood.id,
      },
    });

    return user;
  }
}
