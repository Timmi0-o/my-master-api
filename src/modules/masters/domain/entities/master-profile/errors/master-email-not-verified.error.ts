import { DomainError } from '@shared/domain/errors';

export class MasterEmailNotVerifiedError extends DomainError {
  constructor(masterProfileId: string) {
    super(
      'MASTER_EMAIL_NOT_VERIFIED',
      'Master email is not verified',
      { masterProfileId },
    );
  }
}
