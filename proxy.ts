import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized: ({ token }) => {
      if (!token) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const refreshTokenExpiresAt = Number(token.refreshTokenExpiresAt ?? 0);
      if (!refreshTokenExpiresAt || now >= refreshTokenExpiresAt) {
        return false;
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
