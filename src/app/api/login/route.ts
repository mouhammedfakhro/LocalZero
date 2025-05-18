// pages/api/login.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET_KEY = 'lTYVm+fPZxKYjJ2NykgczptOBI+I6g8KDhnVZT1M3KE=';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Placeholder user object
  const user = { username: '0405252297', password: 'momme78912' };

  if (username !== user.username || password !== user.password) {
    return NextResponse.json(
      { error: 'invalid user credentials', message: 'Ogiltigt användarnamn eller lösenord' },
      { status: 401 }
    );
  }

  const userPayload = {};

  const token = await new SignJWT(userPayload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(SECRET_KEY));

  return NextResponse.json({ token });
}