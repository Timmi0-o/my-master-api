import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';

export interface IGetNotificationByIdApplicationInput {
  id: string;
  isStaffUser: boolean;
  actorUserId: string;
  params: FindOneParams<INotificationPublicEntity, INotificationRelations>;
}
