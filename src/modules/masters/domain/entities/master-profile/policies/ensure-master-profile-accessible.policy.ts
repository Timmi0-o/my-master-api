import type { IMasterProfileEntity } from '../i-master-profile.entity';
import { MasterProfileForbiddenError } from '../errors';
import type { IMasterProfileActor } from './master-profile-actor.types';

export function ensureMasterProfileAccessible(
  profile: IMasterProfileEntity,
  actor: IMasterProfileActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (profile.userId !== actor.userId) {
    throw new MasterProfileForbiddenError(profile.id);
  }
}
