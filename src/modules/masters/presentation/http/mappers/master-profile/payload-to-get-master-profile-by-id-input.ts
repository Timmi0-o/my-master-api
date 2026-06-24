import type { IGetMasterProfileByIdApplicationInput } from 'src/modules/masters/application/dtos/master-profile/get-master-profile-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetMasterProfileByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
): IGetMasterProfileByIdApplicationInput {
  return {
    id,
    actor: {
      userId: '',
      isStaffUser: false,
    },
    params: {
      selectOptions: presetToSelectOptions(query.preset, false),
    },
  };
}
