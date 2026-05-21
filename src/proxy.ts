import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { url, nextUrl, cookies } = req;

  const session = cookies.get("session")?.value;

  const isAuthPage = ["/account/login", "/account/create"].includes(
    nextUrl.pathname
  );

  const isPublicPage = [
    "/account",
    "/api",
    "/_next",
    "/public",
    "/favicon.ico",
  ].some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (!session && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/account/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
