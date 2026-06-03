import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export type GetMasterServicesOutput = {
  items: IMasterServicePublicEntity[];
  total: number;
};
