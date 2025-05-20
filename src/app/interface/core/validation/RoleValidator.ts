import { AbstractAsyncHandler } from "./handler";

export class RoleValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    if (data.role !== "ORGANIZER" && data.role !== "RESIDENT") {
      return "Option needs to be Organizer or Resident."
    }
    return super.handle(data);
  }
}
