import { AbstractAsyncHandler } from "./handler";
import axios from "axios";

async function emailIsAvailable(email: string): Promise<boolean> {
  try {
    const response = await axios.get("/api/verifyEmail", {
      params: { email },
    });
    console.log("Server response:", response.data);
    return response.data.isValid;
  } catch (error) {
    console.log("Error fetching data: ", error);
    return false;
  }
}

export class EmailValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    const isAvailable = await emailIsAvailable(data.email);
    if (!isAvailable) {
      return "Email is taken.";
    }
    return super.handle(data);
  }
}
