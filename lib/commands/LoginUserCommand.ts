import prisma from "../prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { ICommand } from "./ICommand";

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserCommand implements ICommand<string> {
  constructor(private readonly input: LoginUserInput) {}

  async execute(): Promise<string> {
    const { email, password } = this.input;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    const userPayload = {
      id: user.id.toString(),
      name: user.username,
      isOrganizer: user.role === "ORGANIZER",
    };

    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(SECRET_KEY));

    return token;
  }
}
