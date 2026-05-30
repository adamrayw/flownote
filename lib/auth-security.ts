type AttemptEntry = {
  count: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

const attempts = new Map<string, AttemptEntry>();

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REMEMBER_ME_REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;
export const STANDARD_REFRESH_TTL_SECONDS = 24 * 60 * 60;

function nowMs() {
  return Date.now();
}

function pruneAttempts(currentTime: number) {
  for (const [key, entry] of attempts.entries()) {
    const staleWindow = currentTime - entry.windowStartedAt > WINDOW_MS;
    const staleBlock = entry.blockedUntil > 0 && currentTime > entry.blockedUntil;
    if (staleWindow && staleBlock) {
      attempts.delete(key);
    }
  }
}

export function createRateLimitKey(ip: string, email: string) {
  return `${ip.toLowerCase()}::${email.toLowerCase()}`;
}

export function getClientIpFromHeaders(headers: Record<string, unknown>) {
  const xForwardedFor = headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.trim()) {
    return xForwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  const xRealIp = headers["x-real-ip"];
  if (typeof xRealIp === "string" && xRealIp.trim()) {
    return xRealIp.trim();
  }

  return "unknown";
}

export function getRateLimitStatus(key: string) {
  const currentTime = nowMs();
  pruneAttempts(currentTime);

  const entry = attempts.get(key);
  if (!entry) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.blockedUntil > currentTime) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - currentTime) / 1000),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function markLoginFailure(key: string) {
  const currentTime = nowMs();
  const existing = attempts.get(key);

  if (!existing || currentTime - existing.windowStartedAt > WINDOW_MS) {
    attempts.set(key, {
      count: 1,
      windowStartedAt: currentTime,
      blockedUntil: 0,
    });
    return;
  }

  existing.count += 1;
  if (existing.count >= MAX_FAILED_ATTEMPTS) {
    existing.blockedUntil = currentTime + BLOCK_MS;
  }
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
