import type { IUser } from "@/api/auth/auth.model";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: IUser & DefaultSession["user"];
  }
}
