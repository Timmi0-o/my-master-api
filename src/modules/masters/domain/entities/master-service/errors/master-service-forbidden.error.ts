import { DomainError } from '@shared/domain/errors';

export class MasterServiceForbiddenError extends DomainError {
  constructor(masterServiceId: string) {
    super('MASTER_SERVICE_FORBIDDEN', 'Master service access forbidden', {
      masterServiceId,
    });
  }
}
