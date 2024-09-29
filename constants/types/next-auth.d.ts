import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      currency: string;
      language: string;
    } & DefaultSession["user"];
    provider: string;
  }
}
