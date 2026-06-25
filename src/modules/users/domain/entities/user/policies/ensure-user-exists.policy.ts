import type { IUserEntity } from '../i-user.entity';
import { UserNotFoundError } from '../errors';

/**
 * Проверка, что пользователь существует
 */
export function ensureUserExists(
  entity: IUserEntity | null | undefined,
  id: string,
): asserts entity is IUserEntity {
  if (!entity) {
    throw new UserNotFoundError(id);
  }
}
