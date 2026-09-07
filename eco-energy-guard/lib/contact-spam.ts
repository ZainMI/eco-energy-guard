import { createHash } from "node:crypto";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimits = globalThis as typeof globalThis & {
  contactRateLimits?: Map<string, RateLimitEntry>;
};

const rateLimits =
  globalRateLimits.contactRateLimits ?? new Map<string, RateLimitEntry>();
globalRateLimits.contactRateLimits = rateLimits;

function anonymize(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isContactRateLimited(ipAddress: string, email: string) {
  const now = Date.now();
  const keys = [
    `ip:${anonymize(ipAddress || "unknown")}`,
    `email:${anonymize(email.trim().toLowerCase())}`,
  ];

  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(key);
  }

  if (
    keys.some((key) => {
      const entry = rateLimits.get(key);
      return (
        entry &&
        entry.resetAt > now &&
        entry.count >= RATE_LIMIT_MAX_SUBMISSIONS
      );
    })
  ) {
    return true;
  }

  for (const key of keys) {
    const current = rateLimits.get(key);
    rateLimits.set(key, {
      count: current && current.resetAt > now ? current.count + 1 : 1,
      resetAt:
        current && current.resetAt > now
          ? current.resetAt
          : now + RATE_LIMIT_WINDOW_MS,
    });
  }

  return false;
}

export function looksLikeBusinessPromotion(message: string) {
  const normalized = message.toLowerCase();
  const links = normalized.match(/(?:https?:\/\/|www\.)\S+/g) ?? [];
  const promotionalPhrases = [
    "backlink",
    "guest post",
    "grow your business",
    "lead generation",
    "marketing agency",
    "partnership opportunity",
    "rank on google",
    "seo service",
    "sponsored content",
    "web design service",
    "crypto investment",
    "online casino",
  ];
  const phraseMatches = promotionalPhrases.filter((phrase) =>
    normalized.includes(phrase),
  ).length;

  return (
    links.length >= 2 ||
    (links.length >= 1 && phraseMatches >= 1) ||
    phraseMatches >= 2
  );
}
