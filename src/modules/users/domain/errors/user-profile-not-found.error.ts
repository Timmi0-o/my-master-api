import { DomainError } from 'src/modules/shared/domain/errors';

export class UserProfileNotFoundError extends DomainError {
  constructor(userProfileId: string) {
    super('USER_PROFILE_NOT_FOUND', 'User profile not found', {
      userProfileId,
    });
  }
}
