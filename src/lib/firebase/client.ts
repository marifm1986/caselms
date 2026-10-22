"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "@/lib/env";

// Lazily initialised so public pages never pay for the SDK unless they need it.
let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured. Fill in NEXT_PUBLIC_FIREBASE_* in .env.local.");
  }
  app ??= getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export const firebaseAuth = (): Auth => getAuth(getFirebaseApp());
export const firestore = (): Firestore => getFirestore(getFirebaseApp());
