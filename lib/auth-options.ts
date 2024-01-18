import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // import Firestore functions
import { app } from "./firebase";

const db = getFirestore(app); // initialize Firestore

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {

        const docRef = doc(db, "users", credentials?.email ?? ""); // replace "users" with your collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().password === credentials?.password) {
          const user = { id: docSnap.id, name: docSnap.data().name, email: credentials?.email };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
  },
};