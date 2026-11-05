import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  if (isPublic) {
    return NextResponse.next();
  }

  // Strict check for valid Supabase auth cookies
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasAuthCookie) {
    // If an unauthenticated API call is made, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized API Request" }, { status: 401 });
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/decision-room/:path*",
    "/pulse/:path*",
    "/benchmarks/:path*",
    "/timeline/:path*",
    "/analytics/:path*",
    "/revenue/:path*",
    "/expenses/:path*",
    "/forecasting/:path*",
    "/simulator/:path*",
    "/copilot/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/api/:path*",
  ],
};
