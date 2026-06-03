import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';

export type GetMasterProfilesOutput = {
  items: IMasterProfilePublicEntity[];
  total: number;
};
