import type {
  IFavoriteMasterServiceEntity,
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import { mapMasterServiceRow } from '../master-service/map-master-service-row';
import type { MasterServiceRow } from '../master-service/master-service.row.types';
import type { FavoriteMasterServiceRow } from './favorite-master-service.row.types';

function mapUserRelation(
  row: NonNullable<FavoriteMasterServiceRow['user']>,
): IFavoriteMasterServiceRelations['user'] {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
  };
}

export function mapFavoriteMasterServiceRow(
  row: FavoriteMasterServiceRow,
): IFavoriteMasterServicePublicEntity &
  Partial<IFavoriteMasterServiceRelations> {
  const entity: IFavoriteMasterServiceEntity &
    Partial<IFavoriteMasterServiceRelations> = {
    id: row.id,
    userId: row.userId,
    masterServiceId: row.masterServiceId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.user != null) {
    entity.user = mapUserRelation(row.user);
  }

  if (row.masterService != null) {
    entity.masterService = mapMasterServiceRow(
      row.masterService as MasterServiceRow,
    );
  }

  return entity;
}
