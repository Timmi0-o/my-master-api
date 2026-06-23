import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export type IGetMyServicesApplicationOutput = {
  items: IMasterServicePublicEntity[];
  total: number;
};
