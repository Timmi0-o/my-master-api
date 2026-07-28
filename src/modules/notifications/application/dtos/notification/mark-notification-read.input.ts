import type { INotificationActor } from 'src/modules/notifications/domain/entities/notification';

export interface IMarkNotificationReadApplicationInput {
  id: string;
  actor: INotificationActor;
}
