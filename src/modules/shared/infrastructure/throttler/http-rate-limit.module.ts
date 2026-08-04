import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { loadRedisConfig } from '../redis/redis.config';
import {
  HTTP_RATE_LIMIT_ERROR_MESSAGE,
  HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
} from './http-rate-limit.constants';

/** Fallback only — endpoints override via rate-limit decorators. */
const HTTP_RATE_LIMIT_FALLBACK_LIMIT = 120;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: HTTP_RATE_LIMIT_WINDOW_MILLISECONDS,
          limit: HTTP_RATE_LIMIT_FALLBACK_LIMIT,
        },
      ],
      errorMessage: HTTP_RATE_LIMIT_ERROR_MESSAGE,
      storage: new ThrottlerStorageRedisService(loadRedisConfig().url),
    }),
  ],
  exports: [ThrottlerModule],
})
export class HttpRateLimitModule {}
