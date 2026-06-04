import { DomainError } from 'src/modules/shared/domain/errors';

export class MasterScheduleExceptionNotFoundError extends DomainError {
  constructor(masterScheduleExceptionId: string) {
    super(
      'MASTER_SCHEDULE_EXCEPTION_NOT_FOUND',
      'Master schedule exception not found',
      { masterScheduleExceptionId },
    );
  }
}
