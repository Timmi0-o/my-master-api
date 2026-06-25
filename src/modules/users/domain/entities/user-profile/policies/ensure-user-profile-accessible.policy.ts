import type { IUserProfileEntity } from '../i-user-profile.entity';
import { UserProfileForbiddenError } from '../errors';
import type { IUserProfileActor } from './user-profile-actor.types';

/**
 * Проверка, что профиль пользователя доступен актору (владелец или персонал)
 */
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
