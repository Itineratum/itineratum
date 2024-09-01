import JWTToken from "@/constants/types/jwtToken";
import { credentialsLogIn, signIn } from "@/services/database/users";
import NextAuth, { Account, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
  CredentialsProvider({
    credentials: {
      email: { name: "Email", type: "text" },
      password: { name: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email ?? "";
      const password = credentials?.password ?? "";
      const res = await credentialsLogIn(email, password);

      if (res?.success && res.data) {
        const user = {
          id: res.data.id,
          email: res.data.email,
        } as User;
        return user;
      } else {
        return null;
      }
    },
  }),
];
const callbacks = {
  async jwt({ token, account }: { token: JWTToken; account?: Account | null }) {
    // store the provider information in the token
    if (account) {
      token.provider = account.provider;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWTToken }) {
    // include the provider information in the session
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
