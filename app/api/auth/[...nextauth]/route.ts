import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions }; // Re-export just in case, though direct import from lib/auth is preferred
