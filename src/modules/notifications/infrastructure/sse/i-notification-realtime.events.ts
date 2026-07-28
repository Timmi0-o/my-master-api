import type { INotificationPublicEntity } from 'src/modules/notifications/domain/entities/notification';

export const NOTIFICATION_SSE_EVENTS = {
  NOTIFICATION_CREATED: 'notification.created',
} as const;

export interface NotificationRealtimeCreatedEvent {
  type: typeof NOTIFICATION_SSE_EVENTS.NOTIFICATION_CREATED;
  notification: INotificationPublicEntity;
}

export type NotificationRealtimeEvent = NotificationRealtimeCreatedEvent;
