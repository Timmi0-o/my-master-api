import type { IUserProfileEntity } from '../i-user-profile.entity';
import { UserProfileForbiddenError } from '../errors';
import type { IUserProfileActor } from './user-profile-actor.types';

export function ensureUserProfileAccessible(
  profile: IUserProfileEntity,
  actor: IUserProfileActor,
): void {
  if (actor.isStaffUser) {
    return;
  }
  if (profile.userId !== actor.userId) {
    throw new UserProfileForbiddenError(profile.id);
  }
}
