import type { IGetMasterProfileByIdApplicationInput } from 'src/modules/masters/application/dtos/master-profile/get-master-profile-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToGetMasterProfileByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMasterProfileByIdApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
    params: {
      selectOptions: presetToSelectOptions(query.preset, isStaffUser),
    },
  };
}
