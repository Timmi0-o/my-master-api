import type { IMasterWeeklyScheduleEntity } from '../i-master-weekly-schedule.entity';
import { MasterWeeklyScheduleNotFoundError } from '../errors';

export function ensureMasterWeeklyScheduleExists(
  entity: IMasterWeeklyScheduleEntity | null | undefined,
  id: string,
): asserts entity is IMasterWeeklyScheduleEntity {
  if (!entity) {
    throw new MasterWeeklyScheduleNotFoundError(id);
  }
}
