import type { ICreateUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/create-user-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateUserProfilePayload } from '../../validation/schemas/create-user-profile-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToCreateUserProfileInput(
  payload: ICreateUserProfilePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateUserProfileApplicationInput {
  return {
    displayName: payload.displayName,
    rating: payload.rating,
    userId: payload.userId,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
