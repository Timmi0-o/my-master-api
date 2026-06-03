import type { IUserActorInput } from '../dtos/common/i-user-actor.input';
import type { IUserProfileEntity } from '../../domain/entities/user-profile';
import { UserProfileForbiddenError } from '../../domain/errors/user-profile-forbidden.error';

export function assertUserProfileAccess(
  profile: IUserProfileEntity,
  actor: IUserActorInput,
): void {
  if (actor.isStaffUser) return;
  if (profile.userId !== actor.userId) {
    throw new UserProfileForbiddenError(profile.id);
  }
}
