import prisma from "../prisma";
import { ICommand } from "./ICommand";

export class GetAllUsersCommand implements ICommand {
  async execute() {
    const users = await prisma.user.findMany();
    return users;
  }
}
