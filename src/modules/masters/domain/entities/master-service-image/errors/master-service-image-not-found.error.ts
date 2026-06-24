import { DomainError } from '@shared/domain/errors';

export class MasterServiceImageNotFoundError extends DomainError {
  constructor(fileId: string, masterServiceId: string) {
    super('MASTER_SERVICE_IMAGE_NOT_FOUND', 'Master service image not found', {
      fileId,
      masterServiceId,
    });
  }
}
