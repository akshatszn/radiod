import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "artist@radiod.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // For MVP testing without a full registration flow and bcrypt:
        // Accept 'radiod123' as universal password. In production, this would be a hashed check.
        if (credentials.password !== 'radiod123') {
          return null; // Incorrect password
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          // Auto-register test user if they use the correct MVP test password
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              isCreator: credentials.email.includes('artist') // Simple rule to test creator vs listener
            }
          });
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', // we can change this to a custom login page later if needed
  }
};
