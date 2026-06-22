import { DomainError } from '@shared/domain/errors';

export class MasterWeeklyScheduleNotFoundError extends DomainError {
  constructor(masterWeeklyScheduleId: string) {
    super('MASTER_WEEKLY_SCHEDULE_NOT_FOUND', 'Master weekly schedule not found', {
      masterWeeklyScheduleId,
    });
  }
}
