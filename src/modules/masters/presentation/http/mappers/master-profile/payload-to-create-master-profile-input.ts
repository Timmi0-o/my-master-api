import type { ICreateMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/create-master-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterProfilePayload } from '../../validation/schemas/create-master-profile-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterProfileInput(
  payload: ICreateMasterProfilePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterProfileApplicationInput {
  return {
    displayName: payload.displayName,
    description: payload.description,
    rating: payload.rating,
    userId: payload.userId,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
