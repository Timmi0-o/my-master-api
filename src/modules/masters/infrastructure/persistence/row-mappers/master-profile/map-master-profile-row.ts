import type { MasterProfile } from '@prisma/client';
import type {
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
} from 'src/modules/masters/domain/entities/master-profile';
import type { MasterProfilePrismaRow } from './master-profile.row.types';

export function mapMasterProfileEntityRow(
  row: MasterProfile | MasterProfilePrismaRow,
): IMasterProfileEntity {
  return {
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
    description: row.description,
    rating: row.rating,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };
}

export function mapMasterProfilePublicRow(
  row: MasterProfilePrismaRow,
): IMasterProfilePublicEntity {
  return mapMasterProfileEntityRow(row);
}
