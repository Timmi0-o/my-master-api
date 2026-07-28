import type { INotificationPublicEntity } from 'src/modules/notifications/domain/entities/notification';

export interface INotificationRealtimePublisher {
  notificationCreated(notification: INotificationPublicEntity): Promise<void>;
}
