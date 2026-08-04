import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { HTTP_RATE_LIMITS } from './http-rate-limit.constants';

const createHttpRateLimitDecorator = (limit: number, ttlMilliseconds: number) =>
  applyDecorators(
    UseGuards(ThrottlerGuard),
    Throttle({
      default: {
        limit,
        ttl: ttlMilliseconds,
      },
    }),
  );

export const AuthStrictRateLimit = () =>
  createHttpRateLimitDecorator(
    HTTP_RATE_LIMITS.authStrict.limit,
    HTTP_RATE_LIMITS.authStrict.ttlMilliseconds,
  );

export const AuthRelaxedRateLimit = () =>
  createHttpRateLimitDecorator(
    HTTP_RATE_LIMITS.authRelaxed.limit,
    HTTP_RATE_LIMITS.authRelaxed.ttlMilliseconds,
  );

export const SearchRateLimit = () =>
  createHttpRateLimitDecorator(
    HTTP_RATE_LIMITS.search.limit,
    HTTP_RATE_LIMITS.search.ttlMilliseconds,
  );

export const BugReportRateLimit = () =>
  createHttpRateLimitDecorator(
    HTTP_RATE_LIMITS.bugReport.limit,
    HTTP_RATE_LIMITS.bugReport.ttlMilliseconds,
  );
