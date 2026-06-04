import type {
  IMasterWeeklyScheduleEntity,
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { MasterWeeklyScheduleRow } from './master-weekly-schedule.row.types';

function mapMasterProfileRelation(
  row: NonNullable<MasterWeeklyScheduleRow['masterProfile']>,
): IMasterWeeklyScheduleRelations['masterProfile'] {
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

export function mapMasterWeeklyScheduleRow(
  row: MasterWeeklyScheduleRow,
): IMasterWeeklySchedulePublicEntity & Partial<IMasterWeeklyScheduleRelations> {
  const entity: IMasterWeeklyScheduleEntity &
    Partial<IMasterWeeklyScheduleRelations> = {
    id: row.id,
    masterProfileId: row.masterProfileId,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.masterProfile != null) {
    entity.masterProfile = mapMasterProfileRelation(row.masterProfile);
  }

  return entity;
}
