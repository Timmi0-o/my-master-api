import type { INotificationActor } from 'src/modules/notifications/domain/entities/notification';

export interface IArchiveNotificationApplicationInput {
  id: string;
  actor: INotificationActor;
}
