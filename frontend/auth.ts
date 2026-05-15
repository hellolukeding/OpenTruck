import NextAuth from "next-auth";

import { getAuthProviders, LOCAL_AUTH_SECRET } from "@/lib/auth-providers";

const PROTECTED_LOCALE_ROUTE_SEGMENTS = new Set([
  "",
  "api-keys",
  "developer",
  "merchant",
  "models",
  "nodes",
  "tenants",
  "upstream-accounts",
]);

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || LOCAL_AUTH_SECRET,
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
      const localeMatch = pathname.match(/^\/(en|zh-CN)(?:\/(.*))?$/);
      const trailingPath = localeMatch?.[2] ?? "";
      const firstSegment = trailingPath.split("/")[0] ?? "";
      const isProtectedRoute =
        localeMatch !== null && PROTECTED_LOCALE_ROUTE_SEGMENTS.has(firstSegment);

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
