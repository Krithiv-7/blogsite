
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/server-config'; // Use server-side auth check

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes (e.g., everything under /admin)
  const protectedRoutes = ['/admin', '/admin/new', '/admin/edit']; // Add more as needed

  // Check if the current path starts with any of the protected route prefixes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('session')?.value; // Get session cookie (adjust name if different)

    // Redirect to login if no session cookie
    if (!token) {
      console.log('Middleware: No session token found, redirecting to login.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token using Firebase Admin SDK (server-side)
      await auth.verifySessionCookie(token, true); // true checks for revocation
      console.log('Middleware: Session token verified for', pathname);
      // If token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // If token verification fails (invalid, expired, revoked), redirect to login
      console.error('Middleware: Session token verification failed:', error);
      // Clear the invalid cookie? Maybe not necessary if redirecting.
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Example: Clear the cookie
      // response.cookies.set('session', '', { maxAge: -1 });
      return response;
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page itself)
     * - signup (signup page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
    // Explicitly include the admin root and its sub-paths
    '/admin/:path*',
   ],
};

// Note: This middleware relies on session cookies being set correctly
// during the login process via an API route (which needs to be created).
