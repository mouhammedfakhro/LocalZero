import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCookie, setCookie } from "cookies-next/server";

const SECRET_KEY = "lTYVm+fPZxKYjJ2NykgczptOBI+I6g8KDhnVZT1M3KE=";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Allow only the landing page
  if (pathname === "/") {
    return res;
  }

  let token = await getCookie("token", { req, res });

  // Optional: handle token stored as JSON string
  if (token && typeof token === "string" && token.startsWith("{")) {
    try {
      const parsed = JSON.parse(token);
      token = parsed.token;
    } catch (e) {
      console.error("Failed to parse token JSON", e);
    }
  }

  // ✅ Print token on every request
  console.log("TOKEN in request:", token);

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
