import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const SECRET_KEY = process.env.SECRET_KEY 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log(email, password);

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const userPayload = {
      id: user.id.toString(),
      name: user.username,
      isOrganizer: user.role === "ORGANIZER" ? true : false
    };

    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(SECRET_KEY));

    return NextResponse.json(token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
