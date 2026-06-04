import type {
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { MasterServiceRow } from './master-service.row.types';

export function mapMasterServiceRow(
  row: MasterServiceRow,
): IMasterServicePublicEntity & Partial<IMasterServiceRelations> {
  const entity: IMasterServiceEntity & Partial<IMasterServiceRelations> = {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    durationMinutes: row.durationMinutes,
    masterProfileId: row.masterProfileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.masterProfile != null) {
    entity.masterProfile = {
      id: row.masterProfile.id,
      userId: row.masterProfile.userId,
      displayName: row.masterProfile.displayName,
      description: row.masterProfile.description,
      rating: row.masterProfile.rating,
      createdAt: row.masterProfile.createdAt,
      updatedAt: row.masterProfile.updatedAt,
      deletedAt: row.masterProfile.deletedAt ?? null,
    };
  }

  return entity;
}
