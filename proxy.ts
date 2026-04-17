import { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define public and private routes
  const authRoutes = ['/sign-in', '/sign-up'];
  const privateRoutes = ['/profile', '/notes'];
  
  // Check if current path is auth or private route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  
  // Get cookies from the request
  const cookieHeader = request.headers.get('cookie') || '';
  
  try {
    // Check if user is authenticated
    const user = await checkSession(cookieHeader);
    
    // If user is authenticated and trying to access auth routes, redirect to profile
    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/profile';
      return Response.redirect(url);
    }
    
    // If user is not authenticated and trying to access private routes, redirect to sign-in
    if (!user && isPrivateRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return Response.redirect(url);
    }
  } catch (error) {
    // If there's an error checking the session and user is trying to access private routes, redirect to sign-in
    if (isPrivateRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return Response.redirect(url);
    }
  }
  
  // Continue with the request if no redirection is needed
  return;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
