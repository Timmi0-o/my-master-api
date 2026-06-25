import type { IMasterServiceEntity } from '../i-master-service.entity';
import { MasterServiceNotFoundError } from '../errors';

/**
 * Проверка, что услуга мастера существует
 */
export function ensureMasterServiceExists(
  entity: IMasterServiceEntity | null | undefined,
  id: string,
): asserts entity is IMasterServiceEntity {
  if (!entity) {
    throw new MasterServiceNotFoundError(id);
  }
}
