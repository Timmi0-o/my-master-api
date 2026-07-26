import type { ICreateUserBlockApplicationInput } from 'src/modules/users/application/dtos/user-block/create-user-block.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateUserBlockPayload } from '../../validation/schemas/create-user-block-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToCreateUserBlockInput(
  payload: ICreateUserBlockPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateUserBlockApplicationInput {
  return {
    blockedUserId: payload.blockedUserId,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
