import type { IDeleteMasterServiceReviewApplicationInput } from 'src/modules/masters/application/dtos/master-service-review/delete-master-service-review.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterServiceReviewInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterServiceReviewApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
