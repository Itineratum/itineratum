import JWTToken from "@/constants/types/jwtToken";
import {
  credentialsLogIn,
  retrieveCurrencyLanguage,
  signIn,
} from "@/services/database/users";
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
    if (account) {
      token.provider = account.provider;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWTToken }) {
    session.provider = token.provider!;

    if (session.user?.email) {
      const res = await retrieveCurrencyLanguage(session.user.email);

      if (res.success) {
        const { currency, language } = res.data!;
        session.user.currency = currency;
        session.user.language = language;
      }
    }

    return session;
  },
  signIn,
};
const pages = {
  error: "/error", // redirect the user back to home page upon error signing in
};

export const authOptions = {
  providers,
  callbacks,
  pages,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
