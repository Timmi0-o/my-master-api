import { DomainError } from 'src/modules/shared/domain/errors';

export class UserProfileForbiddenError extends DomainError {
  constructor(userProfileId: string) {
    super('USER_PROFILE_FORBIDDEN', 'Access to user profile is forbidden', {
      userProfileId,
    });
  }
}
