import { DomainError } from '@shared/domain/errors';

export class MasterWeeklyScheduleForbiddenError extends DomainError {
  constructor(masterWeeklyScheduleId: string) {
    super('MASTER_WEEKLY_SCHEDULE_FORBIDDEN', 'Master weekly schedule access forbidden', {
      masterWeeklyScheduleId,
    });
  }
}
