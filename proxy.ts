import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";
import { parse } from "cookie";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  // Define public and private routes
  const authRoutes = ["/sign-in", "/sign-up"];
  const privateRoutes = ["/profile", "/notes"];

  // Check if current path is auth or private route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Get tokens from cookies
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Token Refresh Logic
  if (!accessToken && refreshToken) {
    const res = await checkSession();
    const setCookie = res.headers["set-cookie"];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken) {
          accessToken = parsed.accessToken;
          cookieStore.set("accessToken", parsed.accessToken, {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          });
        }
      }
    }
  }

  const isAuthenticated = !!(accessToken || refreshToken);

  // If user is authenticated and tries to access auth routes, redirect to home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT authenticated and tries to access private routes, redirect to sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
