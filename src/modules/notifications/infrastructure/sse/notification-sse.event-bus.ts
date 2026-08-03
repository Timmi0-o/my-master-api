import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from '@shared/infrastructure/redis/redis.service';
import type Redis from 'ioredis';
import { Observable, Subject } from 'rxjs';
import type { NotificationRealtimeEvent } from './i-notification-realtime.events';

const NOTIFICATION_SSE_CHANNEL = 'notifications:sse';

@Injectable()
export class NotificationSseEventBus implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationSseEventBus.name);
  private readonly events$ = new Subject<NotificationRealtimeEvent>();
  private subscriber: Redis | null = null;

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit(): Promise<void> {
    this.subscriber = this.redisService.createClient('notifications-sse');
    this.subscriber.on('message', (channel, message) => {
      if (channel !== NOTIFICATION_SSE_CHANNEL) {
        return;
      }

      try {
        this.events$.next(JSON.parse(message) as NotificationRealtimeEvent);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown parse error';
        this.logger.warn(`Invalid notification SSE event: ${errorMessage}`);
      }
    });
    await this.subscriber.subscribe(NOTIFICATION_SSE_CHANNEL);
  }

  async publish(event: NotificationRealtimeEvent): Promise<void> {
    await this.redisService
      .getClient()
      .publish(NOTIFICATION_SSE_CHANNEL, JSON.stringify(event));
  }

  asObservable(): Observable<NotificationRealtimeEvent> {
    return this.events$.asObservable();
  }

  async onModuleDestroy(): Promise<void> {
    this.events$.complete();
    if (!this.subscriber) {
      return;
    }

    await this.subscriber
      .unsubscribe(NOTIFICATION_SSE_CHANNEL)
      .catch(() => undefined);
    await this.subscriber.quit().catch(() => this.subscriber?.disconnect());
    this.subscriber = null;
  }
}
