import type {
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import { mapFileRow } from 'src/modules/files/infrastructure/persistence/row-mappers/file/file.row-mapper';
import type { FileRow } from 'src/modules/files/infrastructure/persistence/row-mappers/file/file.row-mapper';
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
      timezone: row.masterProfile.timezone,
      bookingStatus: row.masterProfile.bookingStatus,
      pausedUntil: row.masterProfile.pausedUntil,
      minNoticeMinutes: row.masterProfile.minNoticeMinutes,
      maxBookingDaysAhead: row.masterProfile.maxBookingDaysAhead,
      slotStepMinutes: row.masterProfile.slotStepMinutes,
      bufferBetweenAppointmentsMinutes:
        row.masterProfile.bufferBetweenAppointmentsMinutes,
      createdAt: row.masterProfile.createdAt,
      updatedAt: row.masterProfile.updatedAt,
      deletedAt: row.masterProfile.deletedAt ?? null,
    };
  }

  if (row.images != null) {
    entity.images = row.images.map((image) => ({
      id: image.id,
      masterServiceId: image.masterServiceId,
      fileId: image.fileId,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      ...(image.file != null
        ? { file: mapFileRow(image.file as FileRow) }
        : {}),
    }));
  }

  return entity;
}
