import type { IImageEntity } from 'src/modules/masters/domain/entities/image';
import type { ImageEntityType } from 'src/modules/masters/domain/entities/image';

export type ImageRow = {
  id: string;
  entityType: ImageEntityType;
  entityId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapImageRow(row: ImageRow): IImageEntity {
  return {
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    fileId: row.fileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
