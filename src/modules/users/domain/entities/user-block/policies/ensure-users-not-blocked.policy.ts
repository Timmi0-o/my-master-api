import type { IUserBlockRepository } from '../../../repositories/user-block/i-user-block.repository';
import { UserBlockInteractionForbiddenError } from '../errors';

export async function ensureUsersNotBlocked(
  userBlockRepository: IUserBlockRepository,
  userIdA: string,
  userIdB: string,
): Promise<void> {
  if (userIdA === userIdB) {
    return;
  }

  const isBlocked = await userBlockRepository.existsActiveBetweenUsers(
    userIdA,
    userIdB,
  );

  if (isBlocked) {
    throw new UserBlockInteractionForbiddenError(userIdA, userIdB);
  }
}
