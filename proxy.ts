import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public and private routes
  const authRoutes = ["/sign-in", "/sign-up"];
  const privateRoutes = ["/profile", "/notes"];

  // Check if current path is auth or private route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Get cookies from the request
  const cookieHeader = request.headers.get("cookie") || "";

  // For now, skip session checking to avoid server-side issues during development
  // In production, you would uncomment the session checking logic

  // If user is trying to access private routes, redirect to sign-in
  if (isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // If user is trying to access auth routes and is already authenticated, redirect to profile
  // This would require session checking in production

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
