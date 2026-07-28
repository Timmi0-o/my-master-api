import type { INotificationActor } from 'src/modules/notifications/domain/entities/notification';

export interface IDeleteNotificationApplicationInput {
  id: string;
  actor: INotificationActor;
}
