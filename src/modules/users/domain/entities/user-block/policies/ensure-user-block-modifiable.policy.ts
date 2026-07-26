import type { IUserBlockEntity } from '../i-user-block.entity';
import { UserBlockForbiddenError } from '../errors';
import type { IUserBlockActor } from './user-block-actor.types';

export function ensureUserBlockModifiable(
  userBlock: IUserBlockEntity,
  actor: IUserBlockActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (userBlock.blockerUserId === actor.userId) {
    return;
  }

  throw new UserBlockForbiddenError(userBlock.id);
}
