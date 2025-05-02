
// src/lib/auth/server-actions-auth.ts
import 'server-only'; // Ensures this module runs only on the server

import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase/server-config'; // Use server-side Admin SDK
import type { User } from '@/types';

export async function getAuthenticatedUser(): Promise<User | null> {
  const session = cookies().get('session')?.value || '';

  // Validate if session cookie exists
  if (!session) {
    return null;
  }

  try {
    // Verify session cookie using Firebase Admin SDK
    const decodedClaims = await auth.verifySessionCookie(session, true); // true checks for revocation

    // Return user object in the desired format
    const user: User = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
      username: decodedClaims.name || null, // 'name' claim usually holds displayName
    };
    return user;
  } catch (error) {
    // Session cookie is invalid or expired. Force user to login.
    console.error('Failed to verify session cookie:', error);
    return null;
  }
}
