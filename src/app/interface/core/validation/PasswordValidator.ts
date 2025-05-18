import { AbstractAsyncHandler } from "./handler";

export class PasswordValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    if (data.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return super.handle(data);
  }
}
