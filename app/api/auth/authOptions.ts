import JWTToken from "@/constants/types/jwtToken";
import {
  credentialsLogIn,
  googleLogIn,
  signIn,
} from "@/services/database/users";
import { Account, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    async profile(profile) {
      const email = profile.email;
      const res = await googleLogIn(email);
      const isExistingUser = res.isExistingUser;
      const user = {
        id: isExistingUser ? res.id : profile.sub,
        email: profile.email,
        name: isExistingUser ? res.name : profile.name,
        image: isExistingUser ? res.image : profile.picture,
      } as User;
      return user;
    },
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
          name: res.data.firstName,
          image: res.data.image,
        } as User;
        return user;
      } else {
        return null;
      }
    },
  }),
];
const callbacks = {
  async jwt({
    token,
    trigger,
    account,
    session,
    user,
  }: {
    token: JWTToken;
    trigger?: string | undefined;
    account?: Account | null;
    session?: any;
    user?: User | undefined;
  }) {
    if (account) {
      token.provider = account.provider;
    }

    if (trigger === "update") {
      if (session?.name) {
        token.name = session.name;
      } else if (session?.image) {
        token.picture = session.image;
      }
    }

    if (user) {
      token.name = user.name;
      token.picture = user.image;
    }

    return token;
  },
  async session({ session, token }: { session: Session; token: JWTToken }) {
    session.provider = token.provider!;
    session.user.name = token.name;
    session.user.image = token.picture;
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
