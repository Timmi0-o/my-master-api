import { DomainError } from 'src/modules/shared/domain/errors';

export class MasterWeeklyScheduleForbiddenError extends DomainError {
  constructor(masterWeeklyScheduleId: string) {
    super(
      'MASTER_WEEKLY_SCHEDULE_FORBIDDEN',
      'Access to master weekly schedule is forbidden',
      { masterWeeklyScheduleId },
    );
  }
}
