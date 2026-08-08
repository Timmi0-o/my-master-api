import type { IMasterServiceEntity } from '../i-master-service.entity';
import { MasterServiceNotBookableError } from '../errors/master-service-not-bookable.error';
import { EMasterServiceStatus } from '../master-service-status.enum';

export function ensureMasterServiceBookable(
  service: IMasterServiceEntity,
): void {
  if (
    service.deletedAt != null ||
    service.status !== EMasterServiceStatus.ACTIVE
  ) {
    throw new MasterServiceNotBookableError(service.id);
  }
}
