import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';

export type GetMasterSubscriptionsOutput = {
  items: (IMasterSubscriptionPublicEntity &
    Partial<IMasterSubscriptionRelations>)[];
  total: number;
};
