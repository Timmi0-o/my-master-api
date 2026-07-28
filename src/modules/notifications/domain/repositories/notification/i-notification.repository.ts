import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateNotificationInput,
  INotificationEntity,
  INotificationPublicEntity,
  INotificationRelations,
  IUpdateNotificationInput,
} from '../../entities/notification';

export type INotificationRepository = IReadRepository<
  INotificationPublicEntity,
  string,
  INotificationRelations
> &
  ICreateRepository<INotificationEntity, ICreateNotificationInput> &
  IUpdateRepository<INotificationEntity, string, IUpdateNotificationInput> &
  ISoftDeleteRepository<INotificationEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<INotificationEntity | null>;
    findEntityByUserAndIdempotencyKey(
      userId: string,
      idempotencyKey: string,
      scope?: TransactionScope,
    ): Promise<INotificationEntity | null>;
    countUnreadByUserId(
      userId: string,
      scope?: TransactionScope,
    ): Promise<number>;
    markAllReadByUserId(
      userId: string,
      scope: TransactionScope,
    ): Promise<number>;
  };
