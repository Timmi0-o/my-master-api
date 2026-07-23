import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterSubscriptionInput,
  IMasterSubscriptionEntity,
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from '../../entities/master-subscription';

export type IMasterSubscriptionRepository = IReadRepository<
  IMasterSubscriptionPublicEntity,
  string,
  IMasterSubscriptionRelations
> &
  ICreateRepository<
    IMasterSubscriptionEntity,
    ICreateMasterSubscriptionInput
  > &
  ISoftDeleteRepository<IMasterSubscriptionEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterSubscriptionEntity | null>;
    findEntityByUserAndMasterProfileId(
      userId: string,
      masterProfileId: string,
      scope?: TransactionScope,
    ): Promise<IMasterSubscriptionEntity | null>;
    restore(
      id: string,
      scope: TransactionScope,
    ): Promise<IMasterSubscriptionEntity>;
  };
