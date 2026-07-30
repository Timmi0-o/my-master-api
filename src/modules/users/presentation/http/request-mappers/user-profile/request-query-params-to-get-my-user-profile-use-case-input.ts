import type { IGetMyUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/get-my-user-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { toUserActor } from '../shared/to-user-actor';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToGetMyUserProfileUseCaseInput(
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyUserProfileApplicationInput {
  return {
    actor: toUserActor(sessionUser, isStaffUser),
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(query.preset, isStaffUser)),
    },
  };
}
