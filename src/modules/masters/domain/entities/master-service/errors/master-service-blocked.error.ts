import { DomainError } from '@shared/domain/errors';

export class MasterServiceBlockedError extends DomainError {
  constructor(masterServiceId: string) {
    super('MASTER_SERVICE_BLOCKED', 'Master service is blocked', {
      masterServiceId,
    });
  }
}
