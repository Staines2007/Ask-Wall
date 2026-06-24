import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect /questions
  const isProtected = path.startsWith("/questions");
  // Redirect login page if already logged in
  const isLoginPage = path.startsWith("/login");

  const sessionCookie = req.cookies.get("session")?.value;
  const session = sessionCookie ? verifySession(sessionCookie) : null;

  if (isProtected && !session) {
    // Redirect to login
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && session) {
    // Redirect to /questions
    const questionsUrl = new URL("/questions", req.url);
    return NextResponse.redirect(questionsUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run proxy on pages, skip APIs and static assets
  matcher: [
    "/questions/:path*",
    "/login",
  ],
};
export default proxy;
