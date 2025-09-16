
import { AuthAPI, LoginAPIRes } from "api/Auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import type { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AxiosError } from "axios";

type AuthUser = LoginAPIRes["user"] & {
  access_token: string;
  id?: string | number;
  name?: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text", placeholder: "Enter Your UserName" },
        password: { type: "password", placeholder: "Enter Your Password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.username && credentials?.password) {
            const response = await AuthAPI.login({
              username: credentials?.username,
              password: credentials?.password,
            });
            if (!response?.data) throw new Error("Invalid response from server");
            const user = response.data.user;
            if (!user.is_active) {
              throw new Error("Your account is inactive. Please contact admin.");
            }
            const authUser: AuthUser = {
              ...user,
              access_token: response.data.token,
            };
            // Any object returned will be saved in `user` property of the JWT
            return authUser as unknown as User;
          }
          return null;
        } catch (error: unknown) {
          // console.log(error.response.status, error.response.data?.message);
          // Return an object that will pass error information through to the client-side.
          const err = error as AxiosError<{ message?: string }>;
          const message = err.response?.data?.message || (error as Error).message || "Login failed";
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      session.user = token.user;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as unknown as AuthUser).username;
        token.name = (user as unknown as AuthUser).name;
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
