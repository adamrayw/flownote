import { NextResponse, type NextRequest } from "next/server";
import { raytechSessionCookieName, resolveProductReturnTo } from "@/lib/raytech-account";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(raytechSessionCookieName)?.value;
  const isAuthenticated = Boolean(sessionCookie);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const signInUrl = new URL("/signin", request.url);
    const returnTo = resolveProductReturnTo(request.url);
    if (returnTo) {
      signInUrl.searchParams.set("returnTo", returnTo);
    }
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/signin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/signup") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
