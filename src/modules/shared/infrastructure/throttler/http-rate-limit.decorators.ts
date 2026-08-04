import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  HTTP_RATE_LIMITS,
  type THttpRateLimitPreset,
} from './http-rate-limit.constants';

export const RateLimiter = (preset: THttpRateLimitPreset) => {
  const { limit, ttlMilliseconds } = HTTP_RATE_LIMITS[preset];

  return applyDecorators(
    UseGuards(ThrottlerGuard),
    Throttle({
      default: {
        limit,
        ttl: ttlMilliseconds,
      },
    }),
  );
};
