import type { IMasterSubscriptionPublicEntity } from './i-master-subscription.entity';

export const MASTER_SUBSCRIPTION_SELECT_FIELDS = [
  'id',
  'userId',
  'masterProfileId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IMasterSubscriptionPublicEntity)[];

export const MASTER_SUBSCRIPTION_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof IMasterSubscriptionPublicEntity)[];
