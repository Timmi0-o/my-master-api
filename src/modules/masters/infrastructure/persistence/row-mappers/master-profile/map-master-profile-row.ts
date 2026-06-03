import type {
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { MasterServiceRelationRow } from '../master-service/master-service.row.types';
import type { MasterProfileRow } from './master-profile.row.types';

function mapMasterServiceRelationRow(
  row: MasterServiceRelationRow,
): IMasterServicePublicEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    masterProfileId: row.masterProfileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: null,
  };
}

export function mapMasterProfileRow(
  row: MasterProfileRow,
): IMasterProfilePublicEntity & Partial<IMasterProfileRelations> {
  const entity: IMasterProfileEntity & Partial<IMasterProfileRelations> = {
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
    description: row.description,
    rating: row.rating,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.services?.length) {
    entity.services = row.services.map(mapMasterServiceRelationRow);
  }

  return entity;
}
