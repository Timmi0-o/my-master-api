import type { MasterService } from '@prisma/client';
import type {
  IMasterServiceEntity,
  IMasterServicePublicEntity,
} from 'src/modules/masters/domain/entities/master-service';
import type { MasterServicePrismaRow } from './master-service.row.types';

export function mapMasterServiceEntityRow(
  row: MasterService | MasterServicePrismaRow,
): IMasterServiceEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    masterProfileId: row.masterProfileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };
}

export function mapMasterServicePublicRow(
  row: MasterServicePrismaRow,
): IMasterServicePublicEntity {
  return mapMasterServiceEntityRow(row);
}
