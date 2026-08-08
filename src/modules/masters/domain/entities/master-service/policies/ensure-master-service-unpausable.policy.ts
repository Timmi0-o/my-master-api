import type { IMasterServiceEntity } from '../i-master-service.entity';
import { MasterServiceInvalidStatusTransitionError } from '../errors/master-service-invalid-status-transition.error';
import { EMasterServiceStatus } from '../master-service-status.enum';

export function ensureMasterServiceUnpausable(
  service: IMasterServiceEntity,
): void {
  if (service.status !== EMasterServiceStatus.PAUSED) {
    throw new MasterServiceInvalidStatusTransitionError(service.id);
  }
}
