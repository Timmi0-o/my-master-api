import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';

export interface IGetFavoriteMasterServiceByIdApplicationInput {
  id: string;
  isStaffUser: boolean;
  params: FindOneParams<
    IFavoriteMasterServicePublicEntity,
    IFavoriteMasterServiceRelations
  >;
}
