import { format } from "date-fns";
import auth from "./service/auth";

export function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), "PPP p");
  } catch (error) {
    console.error("Invalid date passed to formatDate:", date);
    return "";
  }
}

export function getCurrentUserId(): number | null {
  try {
    const user = auth.getCurrentUser() as { id: number } | null;
    return Number(user?.id) ?? null;
  } catch (err) {
    console.error("Failed to get user ID from token", err);
    return null;
  }
}

export function getCurrentUserName(): string | null {
  try {
    const user = auth.getCurrentUser() as { name: string } | null;
    return user?.name ?? null;
  } catch (err) {
    console.error("Failed to get user ID from token", err);
    return null;
  }
}

export function userIsOrganizer(): boolean | null {
  try {
    const user = auth.getCurrentUser() as { isOrganizer: boolean } | null;
    return user?.isOrganizer ?? null;
  } catch (err) {
    console.error("Failed to get user ID from token", err);
    return null;
  }
}
