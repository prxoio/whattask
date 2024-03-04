import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { initFirestore } from "@auth/firebase-adapter"; // If you're initializing Firestore here
import { cert, initializeApp } from "firebase-admin/app"; // If using service account for Firebase
import CredentialProvider from "next-auth/providers/credentials";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";


export const authOptions = {
  
   pages: {
    signIn: "/", // Sign-in page
  },
  // ... other NextAuth options
};
