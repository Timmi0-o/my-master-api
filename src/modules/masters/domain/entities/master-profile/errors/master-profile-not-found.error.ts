import { DomainError } from '@shared/domain/errors';

export class MasterProfileNotFoundError extends DomainError {
  constructor(masterProfileId: string) {
    super('MASTER_PROFILE_NOT_FOUND', 'Master profile not found', {
      masterProfileId,
    });
  }
}
