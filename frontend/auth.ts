import NextAuth from "next-auth";

import { getAuthProviders } from "@/lib/auth-providers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "opentruck-local-auth-secret",
  providers: getAuthProviders(),
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isProtectedRoute = pathname.startsWith("/en") || pathname.startsWith("/zh-CN");

      if (!isProtectedRoute) {
        return true;
      }

      if (auth) {
        return true;
      }

      const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
      return Response.redirect(signInUrl);
    },
  },
});
