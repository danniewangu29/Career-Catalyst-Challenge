import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/experiences",
  "/skills",
  "/career-path",
  "/network",
  "/career-tasks",
  "/resources",
  "/privacy",
];

export function proxy(request: NextRequest) {
  const session = request.cookies.get("piopath_session")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathname === "/login" || pathname === "/register") &&
    session
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/experiences/:path*",
    "/skills/:path*",
    "/career-path/:path*",
    "/network/:path*",
    "/career-tasks/:path*",
    "/resources/:path*",
    "/privacy/:path*",
    "/login",
    "/register"
  ],
};