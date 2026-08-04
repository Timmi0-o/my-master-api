export const HTTP_RATE_LIMIT_WINDOW_MILLISECONDS = 60_000;

/**
 * Per-IP limits for a rolling 1-minute window.
 * Apply with `@RateLimiter('preset')` on controllers or methods.
 */
export const HTTP_RATE_LIMITS = {
  /** login / register / password reset / email verify */
  authStrict: {
    limit: 5,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** refresh / logout / me / change-password */
  authRelaxed: {
    limit: 30,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** bug-reports create / presign */
  publicWrite: {
    limit: 10,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** search, geo, public profile address */
  publicRead: {
    limit: 60,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** file share by public token */
  publicTokenRead: {
    limit: 30,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** typical authenticated CRUD (masters, appointments, users, …) */
  standard: {
    limit: 90,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** chat / notifications polling-style reads */
  highRead: {
    limit: 120,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** files / folders / image presign */
  mediaWrite: {
    limit: 20,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** web-push subscribe / list */
  webPush: {
    limit: 30,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  /** roles / permissions / admin user ops */
  admin: {
    limit: 60,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
} as const;

export type THttpRateLimitPreset = keyof typeof HTTP_RATE_LIMITS;

export const HTTP_RATE_LIMIT_ERROR_MESSAGE =
  'Слишком много запросов. Попробуйте позже.';
