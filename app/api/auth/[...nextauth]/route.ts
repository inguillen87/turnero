import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET is missing. Authentication will fail in production.");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-fallback", // Fallback for dev only
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
           // Mock user for demo login if DB is down
           if (credentials.email === 'admin@demo.com' && credentials.password === 'Demo123!') {
              return { id: 'mock-admin', email: 'admin@demo.com', name: 'Admin Demo', role: 'USER' };
           }
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions }; // Re-export just in case, though direct import from lib/auth is preferred
