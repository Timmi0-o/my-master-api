import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export interface ISearchByTextApplicationInput {
  q?: string;
  category?: EMasterServiceCategory;
  limit?: number;
}

export type ISearchByTextApplicationOutput = {
  masters: IMasterProfilePublicEntity[];
  services: IMasterServicePublicEntity[];
};
