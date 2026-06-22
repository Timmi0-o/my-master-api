import { DomainError } from '@shared/domain/errors';

export class MasterProfileForbiddenError extends DomainError {
  constructor(masterProfileId: string) {
    super('MASTER_PROFILE_FORBIDDEN', 'Access to master profile is forbidden', {
      masterProfileId,
    });
  }
}
