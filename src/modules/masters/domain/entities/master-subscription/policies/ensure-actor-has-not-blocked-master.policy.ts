import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import { MasterSubscriptionBlockedUserError } from '../errors';

export async function ensureActorHasNotBlockedMaster(
  userBlockRepository: IUserBlockRepository,
  actorUserId: string,
  masterUserId: string,
): Promise<void> {
  const block = await userBlockRepository.findEntityByBlockerAndBlocked(
    actorUserId,
    masterUserId,
  );

  if (block && block.deletedAt == null) {
    throw new MasterSubscriptionBlockedUserError(masterUserId);
  }
}
