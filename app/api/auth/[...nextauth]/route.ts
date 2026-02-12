import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET is missing. Authentication will fail in production.");
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions }; // Re-export just in case, though direct import from lib/auth is preferred
