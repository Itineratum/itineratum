import JWTToken from "@/constants/types/jwtToken";
import { signIn } from "@/services/database/users";
import NextAuth, { Account, Session } from "next-auth";
import Google from "next-auth/providers/google";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
];
const callbacks = {
  async jwt({ token, account }: { token: JWTToken; account?: Account | null }) {
    // Store the provider information in the token
    if (account) {
      token.provider = account.provider;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWTToken }) {
    // Include the provider information in the session
    session.provider = token.provider!;
    return session;
  },
};
const events = {
  signIn,
};

export const authOptions = {
  providers,
  callbacks,
  events,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
