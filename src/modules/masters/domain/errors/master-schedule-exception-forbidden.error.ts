import { DomainError } from 'src/modules/shared/domain/errors';

export class MasterScheduleExceptionForbiddenError extends DomainError {
  constructor(masterScheduleExceptionId: string) {
    super(
      'MASTER_SCHEDULE_EXCEPTION_FORBIDDEN',
      'Access to master schedule exception is forbidden',
      { masterScheduleExceptionId },
    );
  }
}
