import type { IMasterServiceImageEntity } from 'src/modules/masters/domain/entities/master-service-image';

export type MasterServiceImageRow = {
  id: string;
  masterServiceId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapMasterServiceImageRow(
  row: MasterServiceImageRow,
): IMasterServiceImageEntity {
  return {
    id: row.id,
    masterServiceId: row.masterServiceId,
    fileId: row.fileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
