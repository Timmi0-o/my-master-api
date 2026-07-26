import { UserBlockCannotBlockSelfError } from '../errors';
import type { IUserBlockActor } from './user-block-actor.types';

export function ensureCanCreateUserBlock(
  blockedUserId: string,
  actor: IUserBlockActor,
): void {
  if (blockedUserId === actor.userId) {
    throw new UserBlockCannotBlockSelfError(actor.userId);
  }
}
