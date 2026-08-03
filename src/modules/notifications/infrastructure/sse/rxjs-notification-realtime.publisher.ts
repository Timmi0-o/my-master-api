import { Injectable } from '@nestjs/common';
import type { INotificationRealtimePublisher } from 'src/modules/notifications/application/ports/i-notification-realtime.publisher';
import type { INotificationPublicEntity } from 'src/modules/notifications/domain/entities/notification';
import { NOTIFICATION_SSE_EVENTS } from './i-notification-realtime.events';
import { NotificationSseEventBus } from './notification-sse.event-bus';

@Injectable()
export class RxjsNotificationRealtimePublisher implements INotificationRealtimePublisher {
  constructor(private readonly eventBus: NotificationSseEventBus) {}

  async notificationCreated(
    notification: INotificationPublicEntity,
  ): Promise<void> {
    await this.eventBus.publish({
      type: NOTIFICATION_SSE_EVENTS.NOTIFICATION_CREATED,
      notification,
    });
  }
}
