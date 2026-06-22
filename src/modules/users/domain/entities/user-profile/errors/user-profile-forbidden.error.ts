import { DomainError } from '@shared/domain/errors';

export class UserProfileForbiddenError extends DomainError {
  constructor(userProfileId: string) {
    super('USER_PROFILE_FORBIDDEN', 'User profile access forbidden', { userProfileId });
  }
}
