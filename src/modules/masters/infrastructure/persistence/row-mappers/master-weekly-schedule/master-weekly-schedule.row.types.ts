import type { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule.enum';
import type { MasterProfileRelationRow } from '../master-service/master-service.row.types';

export type MasterWeeklyScheduleRow = {
  id: string;
  masterProfileId: string;
  dayOfWeek: EDayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  masterProfile?: MasterProfileRelationRow | null;
};
