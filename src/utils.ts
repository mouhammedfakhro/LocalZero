import { format } from "date-fns";

export function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), "PPP p");
  } catch (error) {
    console.error("Invalid date passed to formatDate:", date);
    return "";
  }
}
