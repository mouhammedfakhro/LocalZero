import { AbstractAsyncHandler } from "./handler";
import axios from "axios";

async function locationIsValid(location: string): Promise<boolean> {
  try {
    const response = await axios.get("/api/verifyLocation", {
      params: { location },
    });
    return response.data.isValid;
  } catch (error) {
    return false;
  }
}

export class LocationValidator extends AbstractAsyncHandler {
  public async handle(data: any): Promise<string | null> {
    const isValid = await locationIsValid(data.location);
    console.log(data.location);
    if (!isValid) {
      return "Location is not a real option.";
    }
    return super.handle(data);
  }
}
