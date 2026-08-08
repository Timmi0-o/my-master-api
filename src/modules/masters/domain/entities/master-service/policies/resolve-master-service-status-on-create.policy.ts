import { EMasterServiceStatus } from '../master-service-status.enum';

export function resolveMasterServiceStatusOnCreate(): EMasterServiceStatus {
  return EMasterServiceStatus.REVIEWING;
}
