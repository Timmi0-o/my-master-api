import type { IUpdateMasterServiceInput } from '../i-update-master-service.input';
import { EMasterServiceStatus } from '../master-service-status.enum';
import { MASTER_SERVICE_MODERATION_CONTENT_FIELDS } from './master-service-moderation.constants';

export function doesMasterServiceUpdateRequireRemoderation(
  patch: IUpdateMasterServiceInput,
): boolean {
  return MASTER_SERVICE_MODERATION_CONTENT_FIELDS.some(
    (field) => patch[field] !== undefined,
  );
}

export function resolveMasterServiceStatusOnUpdate(
  currentStatus: EMasterServiceStatus,
  patch: IUpdateMasterServiceInput,
): EMasterServiceStatus {
  if (currentStatus === EMasterServiceStatus.BLOCKED) {
    return currentStatus;
  }

  if (doesMasterServiceUpdateRequireRemoderation(patch)) {
    return EMasterServiceStatus.REVIEWING;
  }

  return currentStatus;
}
