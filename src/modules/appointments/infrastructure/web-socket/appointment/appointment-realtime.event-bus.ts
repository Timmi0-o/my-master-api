import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  parseRedisPubSubMessage,
  serializeForRedisPubSub,
} from '@shared/infrastructure/redis/redis-pubsub-json';
import { RedisService } from '@shared/infrastructure/redis/redis.service';
import type Redis from 'ioredis';
import { Subject, type Subscription } from 'rxjs';
import type { AppointmentRealtimeEvent } from './i-appointment-realtime.events';

const APPOINTMENT_REALTIME_CHANNEL = 'appointments:realtime';

@Injectable()
export class AppointmentRealtimeEventBus
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AppointmentRealtimeEventBus.name);
  private readonly events$ = new Subject<AppointmentRealtimeEvent>();
  private subscriber: Redis | null = null;

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit(): Promise<void> {
    this.subscriber = this.redisService.createClient('appointments-realtime');
    this.subscriber.on('message', (channel, message) => {
      if (channel !== APPOINTMENT_REALTIME_CHANNEL) {
        return;
      }

      try {
        this.events$.next(
          parseRedisPubSubMessage<AppointmentRealtimeEvent>(message),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown parse error';
        this.logger.warn(`Invalid appointment realtime event: ${errorMessage}`);
      }
    });
    await this.subscriber.subscribe(APPOINTMENT_REALTIME_CHANNEL);
  }

  async publish(event: AppointmentRealtimeEvent): Promise<void> {
    await this.redisService
      .getClient()
      .publish(APPOINTMENT_REALTIME_CHANNEL, serializeForRedisPubSub(event));
  }

  subscribe(listener: (event: AppointmentRealtimeEvent) => void): Subscription {
    return this.events$.subscribe(listener);
  }

  async onModuleDestroy(): Promise<void> {
    this.events$.complete();
    if (!this.subscriber) {
      return;
    }

    await this.subscriber
      .unsubscribe(APPOINTMENT_REALTIME_CHANNEL)
      .catch(() => undefined);
    await this.subscriber.quit().catch(() => this.subscriber?.disconnect());
    this.subscriber = null;
  }
}
