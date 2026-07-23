import { MasterServiceReviewReactionForbiddenError } from '../errors';

export function ensureActorOrderedMasterService(
  hasOrderedService: boolean,
  masterServiceId?: string,
): void {
  if (!hasOrderedService) {
    throw new MasterServiceReviewReactionForbiddenError(masterServiceId);
  }
}
