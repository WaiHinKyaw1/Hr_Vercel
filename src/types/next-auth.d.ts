import { ILoginUser } from "models";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ILoginUser & DefaultSession["user"];
  }
}
