import { DomainError } from 'src/modules/shared/domain/errors';

export class MasterServiceNotFoundError extends DomainError {
  constructor(masterServiceId: string) {
    super('MASTER_SERVICE_NOT_FOUND', 'Master service not found', {
      masterServiceId,
    });
  }
}
