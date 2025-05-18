import { AbstractAsyncHandler } from "./handler";

export class NameValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    if (data.name.length < 5) {
      return "Name needs to be at least 5 characters."
    }
    return super.handle(data);
  }
}
