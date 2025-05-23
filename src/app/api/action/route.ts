import { NextResponse } from "next/server";
import { CreateEcoActionCommand } from "../../../../lib/commands/CreateEcoactionCommand";
import { GetEcoActionsCommand } from "../../../../lib/commands/GetEcoActionsCommand";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const command = new CreateEcoActionCommand(body);
    const result = await command.execute();

    return NextResponse.json({
      message: "Action logged successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error("POST error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json({ error: "No user id found." }, { status: 400 });
    }

    const userId = parseInt(userIdParam);
    const command = new GetEcoActionsCommand(userId);
    const actions = await command.execute();

    return NextResponse.json(actions);
  } catch (error: any) {
    console.error("GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
