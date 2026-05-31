import { NextResponse, type NextRequest } from "next/server";
import {
  buildAuthLoginUrl,
  buildAuthRegisterUrl,
  raytechSessionCookieNames,
  resolveProductReturnTo,
} from "@/lib/raytech-account";

function isInternalDataOrPrefetchRequest(request: NextRequest) {
  const accept = request.headers.get("accept") || "";

  return (
    request.nextUrl.searchParams.has("_rsc") ||
    request.nextUrl.searchParams.has("__next_rsc") ||
    request.nextUrl.searchParams.has("__next_router_prefetch") ||
    request.headers.get("rsc") === "1" ||
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("x-middleware-prefetch") === "1" ||
    accept.includes("text/x-component")
  );
}

function isDocumentNavigation(request: NextRequest) {
  if (isInternalDataOrPrefetchRequest(request)) {
    return false;
  }

  const mode = request.headers.get("sec-fetch-mode");
  const dest = request.headers.get("sec-fetch-dest");
  const accept = request.headers.get("accept") || "";

  return mode === "navigate" || dest === "document" || accept.includes("text/html");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = raytechSessionCookieNames
    .map((cookieName) => request.cookies.get(cookieName)?.value)
    .find(Boolean);
  const isAuthenticated = Boolean(sessionCookie);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const returnTo = resolveProductReturnTo(request.url);
    const signInUrl = new URL("/signin", request.url);
    if (returnTo) {
      signInUrl.searchParams.set("returnTo", returnTo);
    }
    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/signin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isDocumentNavigation(request)) {
      const returnTo = request.nextUrl.searchParams.get("returnTo") || undefined;
      return NextResponse.redirect(new URL(buildAuthLoginUrl(returnTo)));
    }

    return NextResponse.next();
  }

  if (pathname === "/signup") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isDocumentNavigation(request)) {
      const returnTo = request.nextUrl.searchParams.get("returnTo") || undefined;
      return NextResponse.redirect(new URL(buildAuthRegisterUrl(returnTo)));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
