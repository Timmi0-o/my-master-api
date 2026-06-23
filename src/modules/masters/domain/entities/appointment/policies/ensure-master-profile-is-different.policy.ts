import type { IMasterProfileEntity } from '../../master-profile/i-master-profile.entity';
import { IMasterProfileActor } from '../../master-profile/policies/master-profile-actor.types';
import { AppointmentMasterIdMustBeStrangerError } from '../errors';

export function ensureMasterProfileIsDifferent(
  profile: IMasterProfileEntity,
  actor: IMasterProfileActor,
): void {
  if (profile.userId === actor.userId) {
    throw new AppointmentMasterIdMustBeStrangerError(profile.id);
  }
}
