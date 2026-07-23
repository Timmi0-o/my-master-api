import type { IMasterProfileEntity } from '../../master-profile';
import { MasterSubscriptionCannotSubscribeToSelfError } from '../errors';
import type { IMasterSubscriptionActor } from './master-subscription-actor.types';

export function ensureCanSubscribeToMaster(
  profile: IMasterProfileEntity,
  actor: IMasterSubscriptionActor,
): void {
  if (profile.userId === actor.userId) {
    throw new MasterSubscriptionCannotSubscribeToSelfError(profile.id);
  }
}
