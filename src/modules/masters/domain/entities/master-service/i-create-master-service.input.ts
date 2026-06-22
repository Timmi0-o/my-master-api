import type { IMasterServiceEntity } from './i-master-service.entity';

export type ICreateMasterServiceInput = Omit<
  IMasterServiceEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
