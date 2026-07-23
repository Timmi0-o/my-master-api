import type { ICreateMasterSubscriptionApplicationInput } from 'src/modules/masters/application/dtos/master-subscription/create-master-subscription.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterSubscriptionPayload } from '../../validation/schemas/create-master-subscription-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterSubscriptionInput(
  payload: ICreateMasterSubscriptionPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterSubscriptionApplicationInput {
  return {
    masterProfileId: payload.masterProfileId,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
