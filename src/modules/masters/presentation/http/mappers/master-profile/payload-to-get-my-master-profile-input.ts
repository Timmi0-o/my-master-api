import type { IGetMyMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/get-my-master-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToGetMyMasterProfileInput(
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyMasterProfileApplicationInput {
  return {
    actor: toMasterActor(sessionUser, isStaffUser),
    params: {
      selectOptions: presetToSelectOptions(query.preset, isStaffUser),
    },
  };
}
