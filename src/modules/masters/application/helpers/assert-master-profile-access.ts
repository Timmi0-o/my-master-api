import type { IMasterActorInput } from '../dtos/common/i-master-actor.input';
import type { IMasterProfileEntity } from '../../domain/entities/master-profile';
import { MasterProfileForbiddenError } from '../../domain/errors/master-profile-forbidden.error';

export function assertMasterProfileAccess(
  profile: IMasterProfileEntity,
  actor: IMasterActorInput,
): void {
  if (actor.isStaffUser) return;
  if (profile.userId !== actor.userId) {
    throw new MasterProfileForbiddenError(profile.id);
  }
}
