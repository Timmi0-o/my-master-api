import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';

export interface IGetMasterSubscriptionByIdApplicationInput {
  id: string;
  isStaffUser: boolean;
  params: FindOneParams<
    IMasterSubscriptionPublicEntity,
    IMasterSubscriptionRelations
  >;
}
