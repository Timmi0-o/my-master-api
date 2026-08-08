import type { IMasterServiceEntity } from '../i-master-service.entity';
import { EMasterServiceStatus } from '../master-service-status.enum';

export function isMasterServicePubliclyVisible(
  service: Pick<IMasterServiceEntity, 'status' | 'deletedAt'>,
): boolean {
  return (
    service.deletedAt == null && service.status === EMasterServiceStatus.ACTIVE
  );
}
