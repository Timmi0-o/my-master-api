export const HTTP_RATE_LIMIT_WINDOW_MILLISECONDS = 60_000;

export const HTTP_RATE_LIMITS = {
  authStrict: {
    limit: 5,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  authRelaxed: {
    limit: 30,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  search: {
    limit: 60,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
  bugReport: {
    limit: 10,
    ttlMilliseconds: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
  },
} as const;

export const HTTP_RATE_LIMIT_ERROR_MESSAGE =
  'Слишком много запросов. Попробуйте позже.';
