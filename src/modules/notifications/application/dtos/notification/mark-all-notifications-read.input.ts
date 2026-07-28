import type { INotificationActor } from 'src/modules/notifications/domain/entities/notification';

export interface IMarkAllNotificationsReadApplicationInput {
  actor: INotificationActor;
}
