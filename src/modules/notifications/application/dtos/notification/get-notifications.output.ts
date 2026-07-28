import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { ReadResult } from 'src/modules/shared/domain/query';

export type GetNotificationsOutput = {
  items: ReadResult<INotificationPublicEntity, INotificationRelations>[];
  total: number;
};
