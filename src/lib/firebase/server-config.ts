
// src/lib/firebase/server-config.ts
import 'server-only'; // Ensures this module runs only on the server

import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors during hot-reloading
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If using Application Default Credentials (e.g., on Cloud Run, GAE, GCE, Cloud Functions)
      // credential: admin.credential.applicationDefault(),

      // If using a service account key file (store securely, e.g., via Secret Manager)
      // Make sure the path is correct or the JSON content is read securely
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in the private key stored in environment variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // Optional: Specify database URL if using Realtime Database
      // databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Use public env for bucket name if needed
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
     console.error('Firebase Admin SDK initialization error:', error.stack);
     // Throwing an error might be appropriate depending on how critical Firebase is
     // throw new Error('Failed to initialize Firebase Admin SDK');
  }
}

// Export initialized services
const auth = admin.auth();
const firestore = admin.firestore(); // Example: if using Firestore
const storage = admin.storage().bucket(); // Example: if using Storage

export { auth, firestore, storage, admin }; // Export admin for other uses if necessary

// Basic check for required config variables (for service account method)
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('Firebase Admin SDK environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are not fully set. Using service account credentials requires these.');
}
