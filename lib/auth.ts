import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REMEMBER_ME_REFRESH_TTL_SECONDS,
  STANDARD_REFRESH_TTL_SECONDS,
  clearLoginFailures,
  createRateLimitKey,
  getClientIpFromHeaders,
  getRateLimitStatus,
  markLoginFailure,
} from "@/lib/auth-security";

type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  rememberMe: boolean;
};

function isTruthy(value: string | undefined) {
  return value === "true" || value === "1" || value === "on";
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_REFRESH_TTL_SECONDS,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const rememberMe = isTruthy(credentials?.remember);

        if (!email || !password) {
          return null;
        }

        const ip = getClientIpFromHeaders(req.headers as Record<string, unknown>);
        const rateLimitKey = createRateLimitKey(ip, email);
        const rateLimit = getRateLimitStatus(rateLimitKey);

        if (!rateLimit.allowed) {
          throw new Error(
            `Too many login attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
          );
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          markLoginFailure(rateLimitKey);
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);
        if (!isValidPassword) {
          markLoginFailure(rateLimitKey);
          return null;
        }

        clearLoginFailures(rateLimitKey);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          rememberMe,
        } satisfies AuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        token.id = user.id;
        token.rememberMe = Boolean((user as AuthUser).rememberMe);
        token.authenticatedAt = now;
        token.accessToken = randomUUID();
        token.accessTokenExpiresAt = now + ACCESS_TOKEN_TTL_SECONDS;
        token.refreshToken = randomUUID();
        token.refreshTokenExpiresAt =
          now +
          (token.rememberMe
            ? REMEMBER_ME_REFRESH_TTL_SECONDS
            : STANDARD_REFRESH_TTL_SECONDS);
        delete token.error;
        return token;
      }

      if (trigger === "update" && session?.user) {
        if (typeof session.user.name === "string") {
          token.name = session.user.name;
        }
        if (typeof session.user.email === "string") {
          token.email = session.user.email;
        }
      }

      if (!token.refreshTokenExpiresAt) {
        token.refreshTokenExpiresAt =
          now +
          (token.rememberMe
            ? REMEMBER_ME_REFRESH_TTL_SECONDS
            : STANDARD_REFRESH_TTL_SECONDS);
      }

      if (now >= Number(token.refreshTokenExpiresAt)) {
        token.error = "RefreshTokenExpired";
        return token;
      }

      const accessTokenExpiresAt = Number(token.accessTokenExpiresAt ?? 0);
      if (accessTokenExpiresAt > now) {
        return token;
      }

      token.accessToken = randomUUID();
      token.accessTokenExpiresAt = now + ACCESS_TOKEN_TTL_SECONDS;
      token.refreshToken = randomUUID();
      delete token.error;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      session.auth = {
        rememberMe: Boolean(token.rememberMe),
        accessTokenExpiresAt: Number(token.accessTokenExpiresAt ?? 0),
        refreshTokenExpiresAt: Number(token.refreshTokenExpiresAt ?? 0),
        error: typeof token.error === "string" ? token.error : null,
      };
      return session;
    },
  },
};
