import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  if (isPublic) {
    return NextResponse.next();
  }

  // Correctly match chunked cookies (sb-*-auth-token.0, sb-*-auth-token.1)
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasAuthCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/analytics/:path*",
    "/revenue/:path*",
    "/expenses/:path*",
    "/forecasting/:path*",
    "/simulator/:path*",
    "/copilot/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
