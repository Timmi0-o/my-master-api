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
import type { AppointmentChatRealtimeEvent } from './appointment-chat-realtime.events';

const APPOINTMENT_CHAT_REALTIME_CHANNEL = 'appointment-chats:realtime';

@Injectable()
export class AppointmentChatRealtimeEventBus
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AppointmentChatRealtimeEventBus.name);
  private readonly events$ = new Subject<AppointmentChatRealtimeEvent>();
  private subscriber: Redis | null = null;

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit(): Promise<void> {
    this.subscriber = this.redisService.createClient(
      'appointment-chats-realtime',
    );
    this.subscriber.on('message', (channel, message) => {
      if (channel !== APPOINTMENT_CHAT_REALTIME_CHANNEL) {
        return;
      }

      try {
        this.events$.next(
          parseRedisPubSubMessage<AppointmentChatRealtimeEvent>(message),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown parse error';
        this.logger.warn(
          `Invalid appointment chat realtime event: ${errorMessage}`,
        );
      }
    });
    await this.subscriber.subscribe(APPOINTMENT_CHAT_REALTIME_CHANNEL);
  }

  async publish(event: AppointmentChatRealtimeEvent): Promise<void> {
    await this.redisService
      .getClient()
      .publish(
        APPOINTMENT_CHAT_REALTIME_CHANNEL,
        serializeForRedisPubSub(event),
      );
  }

  subscribe(
    listener: (event: AppointmentChatRealtimeEvent) => void,
  ): Subscription {
    return this.events$.subscribe(listener);
  }

  async onModuleDestroy(): Promise<void> {
    this.events$.complete();
    if (!this.subscriber) {
      return;
    }

    await this.subscriber
      .unsubscribe(APPOINTMENT_CHAT_REALTIME_CHANNEL)
      .catch(() => undefined);
    await this.subscriber.quit().catch(() => this.subscriber?.disconnect());
    this.subscriber = null;
  }
}
