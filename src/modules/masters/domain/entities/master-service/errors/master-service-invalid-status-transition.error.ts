import { DomainError } from '@shared/domain/errors';

export class MasterServiceInvalidStatusTransitionError extends DomainError {
  constructor(masterServiceId: string) {
    super(
      'MASTER_SERVICE_INVALID_STATUS_TRANSITION',
      'Invalid master service status transition',
      {
        masterServiceId,
      },
    );
  }
}
