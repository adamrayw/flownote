import { NextResponse, type NextRequest } from "next/server";
import {
  buildAuthLoginUrl,
  buildAuthRegisterUrl,
  raytechSessionCookieName,
  resolveProductReturnTo,
} from "@/lib/raytech-account";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(raytechSessionCookieName)?.value;
  const isAuthenticated = Boolean(sessionCookie);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL(buildAuthLoginUrl(resolveProductReturnTo(request.url))));
  }

  if (pathname === "/signin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL(buildAuthLoginUrl(resolveProductReturnTo(request.url))));
  }

  if (pathname === "/signup") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL(buildAuthRegisterUrl(resolveProductReturnTo(request.url))));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
