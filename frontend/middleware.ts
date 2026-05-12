import { auth } from "@/auth";

export { auth as default } from "@/auth";

export const config = {
  matcher: ["/en/:path*", "/zh-CN/:path*"],
};
