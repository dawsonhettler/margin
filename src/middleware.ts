import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  if (isPublic) {
    return NextResponse.next();
  }

  // Safely match any Supabase auth cookies
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

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
