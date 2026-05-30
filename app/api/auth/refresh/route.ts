import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.auth.error === "RefreshTokenExpired") {
    return NextResponse.json(
      { message: "Refresh token expired. Please sign in again." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    expiresAt: {
      accessToken: session.auth.accessTokenExpiresAt,
      refreshToken: session.auth.refreshTokenExpiresAt,
    },
  });
}
