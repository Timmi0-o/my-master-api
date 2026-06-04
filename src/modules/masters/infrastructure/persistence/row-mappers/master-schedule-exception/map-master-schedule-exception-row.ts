import type {
  IMasterScheduleExceptionEntity,
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { MasterScheduleExceptionRow } from './master-schedule-exception.row.types';

function mapMasterProfileRelation(
  row: NonNullable<MasterScheduleExceptionRow['masterProfile']>,
): IMasterScheduleExceptionRelations['masterProfile'] {
  return {
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
    description: row.description,
    rating: row.rating,
    timezone: row.timezone,
    bookingStatus: row.bookingStatus,
    pausedUntil: row.pausedUntil,
    minNoticeMinutes: row.minNoticeMinutes,
    maxBookingDaysAhead: row.maxBookingDaysAhead,
    slotStepMinutes: row.slotStepMinutes,
    bufferBetweenAppointmentsMinutes: row.bufferBetweenAppointmentsMinutes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };
}

export function mapMasterScheduleExceptionRow(
  row: MasterScheduleExceptionRow,
): IMasterScheduleExceptionPublicEntity &
  Partial<IMasterScheduleExceptionRelations> {
  const entity: IMasterScheduleExceptionEntity &
    Partial<IMasterScheduleExceptionRelations> = {
    id: row.id,
    masterProfileId: row.masterProfileId,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    kind: row.kind,
    customStartTime: row.customStartTime,
    customEndTime: row.customEndTime,
    title: row.title,
    note: row.note,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.masterProfile != null) {
    entity.masterProfile = mapMasterProfileRelation(row.masterProfile);
  }

  return entity;
}
