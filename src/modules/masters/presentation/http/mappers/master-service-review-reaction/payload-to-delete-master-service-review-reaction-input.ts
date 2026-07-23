import type { IDeleteMasterServiceReviewReactionApplicationInput } from 'src/modules/masters/application/dtos/master-service-review-reaction/delete-master-service-review-reaction.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterServiceReviewReactionInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterServiceReviewReactionApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
