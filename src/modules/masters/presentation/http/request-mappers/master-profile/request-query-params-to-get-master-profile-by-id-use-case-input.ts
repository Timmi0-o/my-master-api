import type { IGetMasterProfileByIdApplicationInput } from 'src/modules/masters/application/dtos/master-profile/get-master-profile-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToGetMasterProfileByIdUseCaseInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser | null,
  isStaffUser: boolean,
): IGetMasterProfileByIdApplicationInput {
  return {
    id,
    actor: {
      userId: sessionUser?.id ?? '',
      isStaffUser,
    },
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(query.preset, isStaffUser)),
    },
  };
}
