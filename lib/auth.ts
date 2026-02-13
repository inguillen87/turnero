import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const authSecret = process.env.NEXTAUTH_SECRET || "development-secret-fallback";

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET is not set, using fallback secret");
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user;
        try {
           // Ensure we connect to DB or handle error
           user = await prisma.user.findUnique({
             where: { email: credentials.email },
           });
        } catch (e) {
           console.error("Auth DB Connection Error:", e);
           return null;
        }

        if (!user) return null;

        // Verify password
        let isValid = false;

        // Mock hash check for seed data 'hashed_secret' -> 'Demo123!'
        if (user.passwordHash === 'hashed_secret') {
             isValid = credentials.password === 'Demo123!';
        } else {
             try {
                isValid = await bcrypt.compare(credentials.password, user.passwordHash);
             } catch {
                isValid = false;
             }
        }

        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.globalRole || 'USER' };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error", // Custom error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  }
};

// Original getSession placeholder
export async function getSession() {
  if (process.env.DEMO_MODE === '1') {
    return {
      user: {
        id: 'demo-user-id',
        email: 'admin@demo.com',
        globalRole: 'USER', // 'SUPER_ADMIN' for SA testing
      }
    };
  }
  return null;
}
