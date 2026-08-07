import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../queues/queue.constants';
import { toBullMqConnection } from './redis.config';
import { RedisService } from './redis.service';
import { REDIS_SERVICE_TOKEN } from './redis.tokens';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: toBullMqConnection(),
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.APPOINTMENT_REMINDERS },
      { name: QUEUE_NAMES.APPOINTMENT_AUTO_COMPLETE },
      { name: QUEUE_NAMES.APPOINTMENT_CHAT_UNREAD_REMINDERS },
      { name: QUEUE_NAMES.MASTER_ONBOARDING_DEMOTE },
      { name: QUEUE_NAMES.CALL_RING_TIMEOUT },
      { name: QUEUE_NAMES.IMAGE_VARIANTS },
    ),
  ],
  providers: [
    RedisService,
    { provide: REDIS_SERVICE_TOKEN, useExisting: RedisService },
  ],
  exports: [RedisService, REDIS_SERVICE_TOKEN, BullModule],
})
export class RedisModule {}
