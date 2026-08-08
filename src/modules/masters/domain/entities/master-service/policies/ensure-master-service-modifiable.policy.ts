import type { IMasterServiceEntity } from '../i-master-service.entity';
import { MasterServiceBlockedError } from '../errors/master-service-blocked.error';
import { EMasterServiceStatus } from '../master-service-status.enum';

export type IMasterServiceModifiableActor = {
  userId: string;
  isStaffUser: boolean;
};

export function ensureMasterServiceModifiable(
  service: IMasterServiceEntity,
  actor: IMasterServiceModifiableActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (service.status === EMasterServiceStatus.BLOCKED) {
    throw new MasterServiceBlockedError(service.id);
  }
}
