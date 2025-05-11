import { AbstractAsyncHandler } from "./handler";

export class NameValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    if (data.name == "Amer") {
      return "Name is too nice.";
    }
    return super.handle(data);
  }
}
