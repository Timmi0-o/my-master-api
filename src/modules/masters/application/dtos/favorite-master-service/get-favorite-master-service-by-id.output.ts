import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';

export type IGetFavoriteMasterServiceByIdApplicationOutput =
  IFavoriteMasterServicePublicEntity & Partial<IFavoriteMasterServiceRelations>;
