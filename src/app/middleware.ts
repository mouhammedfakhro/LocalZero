import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCookie, setCookie } from "cookies-next/server";

const SECRET_KEY = "lTYVm+fPZxKYjJ2NykgczptOBI+I6g8KDhnVZT1M3KE=";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  let token = await getCookie("token", { req, res });
  console.log("TOKEN: ", token);

  if (token && typeof token === "string" && token.startsWith("{")) {
    try {
      const parsed = JSON.parse(token);
      token = parsed.token;
    } catch (e) {
      console.error("Middleware: Failed to parse token JSON", e);
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  try {
    console.log("Middleware: Verifying token ->", token);

    const { payload: user } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY!)
    );
    setCookie("user", JSON.stringify(user), { req, res });
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher:
    "/((?!api/login|api/auth|api/model/*|login|reset-password|forgot-password|api/forgot-password|api/reset-password|assets|_next/static|_next/image|favicon.ico).*)",
};
