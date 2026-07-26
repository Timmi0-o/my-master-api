import type { IUserBlockEntity } from '../i-user-block.entity';
import { UserBlockNotFoundError } from '../errors';

export function ensureUserBlockExists(
  entity: IUserBlockEntity | null | undefined,
  id: string,
): asserts entity is IUserBlockEntity {
  if (!entity) {
    throw new UserBlockNotFoundError(id);
  }
}
