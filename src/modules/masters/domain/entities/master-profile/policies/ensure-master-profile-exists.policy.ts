import type { IMasterProfileEntity } from '../i-master-profile.entity';
import { MasterProfileNotFoundError } from '../errors';

export function ensureMasterProfileExists(
  entity: IMasterProfileEntity | null | undefined,
  id: string,
): asserts entity is IMasterProfileEntity {
  if (!entity) {
    throw new MasterProfileNotFoundError(id);
  }
}
