import { DomainError } from 'src/modules/shared/domain/errors';

export class MasterServiceForbiddenError extends DomainError {
  constructor(masterServiceId: string) {
    super('MASTER_SERVICE_FORBIDDEN', 'Access to master service is forbidden', {
      masterServiceId,
    });
  }
}
