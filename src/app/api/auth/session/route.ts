
// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/server-config'; // Use Admin SDK

// Set session expiration to 5 days, matching the Firebase session cookie expiration.
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Create the session cookie using the Admin SDK.
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Set cookie policy parameters. SameSite=Lax is generally recommended.
    // Use httpOnly for security. Secure should be true in production.
    const options = {
      name: 'session', // Cookie name used in middleware
      value: sessionCookie,
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/',
      sameSite: 'lax' as const, // Use 'lax' or 'strict'
    };

    console.log("Session cookie created successfully.");

    // Set the cookie in the response
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);

    return response;

  } catch (error: any) {
    console.error('Session cookie creation failed:', error);
    // Handle specific errors like invalid ID token if necessary
    if (error.code === 'auth/invalid-id-token' || error.code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Invalid or expired ID token.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session')?.value;
        if (!sessionCookie) {
            return NextResponse.json({ status: 'No session to clear' }, { status: 200 });
        }

        // Verify the session cookie to get the UID.
        // This step also ensures the cookie is valid before trying to revoke.
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // Check for revocation too

        // Revoke the refresh tokens for the user.
        await auth.revokeRefreshTokens(decodedClaims.sub); // 'sub' is the user ID (uid)

        // Clear the session cookie by setting maxAge to -1
        const options = {
            name: 'session',
            value: '',
            maxAge: -1, // Expire the cookie immediately
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax' as const,
        };

        console.log(`Session cookie for user ${decodedClaims.sub} revoked and cleared.`);

        const response = NextResponse.json({ status: 'success' }, { status: 200 });
        response.cookies.set(options);

        return response;

    } catch (error: any) {
        console.error('Session cookie deletion/revocation failed:', error);
         // If the cookie was already invalid/expired, just clear it
        if (error.code === 'auth/invalid-session-cookie' || error.code === 'auth/session-cookie-expired') {
            const options = { name: 'session', value: '', maxAge: -1, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' as const };
            const response = NextResponse.json({ status: 'Cookie invalid, cleared.' }, { status: 200 });
            response.cookies.set(options);
            return response;
        }
        return NextResponse.json({ error: 'Failed to clear session cookie' }, { status: 500 });
    }
}

// Helper function to call this API route from client-side after login/signup
export async function setSessionCookie(idToken: string): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        return response.ok;
    } catch (error) {
        console.error("Failed to set session cookie via API:", error);
        return false;
    }
}

// Helper function to call this API route from client-side during logout
export async function clearSessionCookie(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth/session', {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error("Failed to clear session cookie via API:", error);
        return false;
    }
}
