import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCookie, setCookie } from "cookies-next/server";

const SECRET_KEY = process.env.SECRET_KEY;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return res;
  }

  let token = await getCookie("token", { req, res });

  if (token && typeof token === "string" && token.startsWith("{")) {
    try {
      const parsed = JSON.parse(token);
      token = parsed.token;
    } catch (e) {
      console.error("Failed to parse token JSON", e);
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload: user } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY)
    );
    setCookie("user", JSON.stringify(user), { req, res });
  } catch (error) {
    console.error("Invalid token", error);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!^$|_next|favicon.ico|api|assets|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)",
  ],
};
