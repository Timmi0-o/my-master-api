import type { IGetUserProfileByIdApplicationInput } from 'src/modules/users/application/dtos/user-profile/get-user-profile-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToGetUserProfileByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetUserProfileByIdApplicationInput {
  return {
    id,
    actor: toUserActor(sessionUser, isStaffUser),
    params: {
      selectOptions: presetToSelectOptions(query.preset, isStaffUser),
    },
  };
}
