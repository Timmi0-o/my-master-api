import { DomainError } from '@shared/domain/errors';

export class MasterScheduleExceptionForbiddenError extends DomainError {
  constructor(masterScheduleExceptionId: string) {
    super('MASTER_SCHEDULE_EXCEPTION_FORBIDDEN', 'Master schedule exception access forbidden', {
      masterScheduleExceptionId,
    });
  }
}
