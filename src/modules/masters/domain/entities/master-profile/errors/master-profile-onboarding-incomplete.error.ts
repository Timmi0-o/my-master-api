import { DomainError } from '@shared/domain/errors';

export const MASTER_PROFILE_ONBOARDING_INCOMPLETE_CODE =
  'MASTER_PROFILE_ONBOARDING_INCOMPLETE';

export class MasterProfileOnboardingIncompleteError extends DomainError {
  constructor(masterProfileId: string) {
    super(
      MASTER_PROFILE_ONBOARDING_INCOMPLETE_CODE,
      MASTER_PROFILE_ONBOARDING_INCOMPLETE_CODE,
      { masterProfileId },
    );
  }
}
