import type { IUserProfileEntity } from '../i-user-profile.entity';
import { UserProfileNotFoundError } from '../errors';

export function ensureUserProfileExists(
  entity: IUserProfileEntity | null | undefined,
  id: string,
): asserts entity is IUserProfileEntity {
  if (!entity) {
    throw new UserProfileNotFoundError(id);
  }
}
