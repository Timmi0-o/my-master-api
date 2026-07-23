import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';

export type IGetMasterSubscriptionByIdApplicationOutput =
  IMasterSubscriptionPublicEntity & Partial<IMasterSubscriptionRelations>;
