import type { IMasterProfileEntity } from '../../../../../masters/domain/entities/master-profile/i-master-profile.entity';
import { IMasterProfileActor } from '../../../../../masters/domain/entities/master-profile/policies/master-profile-actor.types';
import { AppointmentMasterIdMustBeStrangerError } from '../errors';

/**
 * Проверка, что мастер не может записаться на себя
 */
export function ensureMasterProfileIsDifferent(
  profile: IMasterProfileEntity,
  actor: IMasterProfileActor,
): void {
  if (profile.userId === actor.userId) {
    throw new AppointmentMasterIdMustBeStrangerError(profile.id);
  }
}
