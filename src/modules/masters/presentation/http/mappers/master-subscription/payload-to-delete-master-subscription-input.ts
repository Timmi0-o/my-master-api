import type { IDeleteMasterSubscriptionApplicationInput } from 'src/modules/masters/application/dtos/master-subscription/delete-master-subscription.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterSubscriptionInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterSubscriptionApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
