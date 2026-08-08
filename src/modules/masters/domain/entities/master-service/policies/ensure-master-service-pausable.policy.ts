import type { IMasterServiceEntity } from '../i-master-service.entity';
import { MasterServiceInvalidStatusTransitionError } from '../errors/master-service-invalid-status-transition.error';
import { EMasterServiceStatus } from '../master-service-status.enum';

export function ensureMasterServicePausable(
  service: IMasterServiceEntity,
): void {
  if (service.status !== EMasterServiceStatus.ACTIVE) {
    throw new MasterServiceInvalidStatusTransitionError(service.id);
  }
}
