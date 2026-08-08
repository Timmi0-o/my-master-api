import { DomainError } from '@shared/domain/errors';

export class MasterServiceNotBookableError extends DomainError {
  constructor(masterServiceId: string) {
    super(
      'MASTER_SERVICE_NOT_BOOKABLE',
      'Master service is not available for booking',
      {
        masterServiceId,
      },
    );
  }
}
