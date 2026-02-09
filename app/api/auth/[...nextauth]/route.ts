import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// Mock User
const MOCK_USER = {
  id: "mock-user-id",
  email: "admin@turnero.com",
  passwordHash: "$2b$10$GoeC/sBkiQoNFVu2s22NkO02mf2r8e.z7gMXbwK7o6IUgRhx4U0Ba", // "password"
  name: "Admin User",
  role: "admin",
  tenantId: "demo-tenant-id"
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email !== MOCK_USER.email) {
            return null;
        }

        const isValid = await compare(credentials.password, MOCK_USER.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: MOCK_USER.id,
          name: MOCK_USER.name,
          email: MOCK_USER.email,
          role: MOCK_USER.role,
          tenantId: MOCK_USER.tenantId,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
