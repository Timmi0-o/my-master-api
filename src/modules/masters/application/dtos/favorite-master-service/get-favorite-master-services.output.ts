import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';

export type GetFavoriteMasterServicesOutput = {
  items: (IFavoriteMasterServicePublicEntity &
    Partial<IFavoriteMasterServiceRelations>)[];
  total: number;
};
