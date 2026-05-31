import { NextResponse, type NextRequest } from "next/server";
import {
  buildAuthLoginUrl,
  buildAuthRegisterUrl,
  raytechSessionCookieNames,
  resolveProductReturnTo,
} from "@/lib/raytech-account";

function isRscRequest(request: NextRequest) {
  return (
    request.nextUrl.searchParams.has("_rsc") ||
    request.headers.get("rsc") === "1" ||
    request.headers.get("accept")?.includes("text/x-component") === true
  );
}

function getReturnToFromQueryOrDefault(request: NextRequest) {
  const queryReturnTo = request.nextUrl.searchParams.get("returnTo");
  if (queryReturnTo) {
    return queryReturnTo;
  }

  return new URL("/dashboard", request.url).toString();
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = raytechSessionCookieNames
    .map((cookieName) => request.cookies.get(cookieName)?.value)
    .find(Boolean);
  const isAuthenticated = Boolean(sessionCookie);
  const isRsc = isRscRequest(request);

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const returnTo = resolveProductReturnTo(request.url);

    if (!isRsc) {
      return NextResponse.redirect(new URL(buildAuthLoginUrl(returnTo)));
    }

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

    if (!isRsc) {
      return NextResponse.redirect(
        new URL(buildAuthLoginUrl(getReturnToFromQueryOrDefault(request))),
      );
    }

    return NextResponse.next();
  }

  if (pathname === "/signup") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isRsc) {
      return NextResponse.redirect(
        new URL(buildAuthRegisterUrl(getReturnToFromQueryOrDefault(request))),
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
