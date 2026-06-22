import type { IMasterScheduleExceptionEntity } from '../i-master-schedule-exception.entity';
import { MasterScheduleExceptionNotFoundError } from '../errors';

export function ensureMasterScheduleExceptionExists(
  entity: IMasterScheduleExceptionEntity | null | undefined,
  id: string,
): asserts entity is IMasterScheduleExceptionEntity {
  if (!entity) {
    throw new MasterScheduleExceptionNotFoundError(id);
  }
}
