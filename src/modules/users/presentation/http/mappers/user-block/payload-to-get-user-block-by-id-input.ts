import type { IGetUserBlockByIdApplicationInput } from 'src/modules/users/application/dtos/user-block/get-user-block-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function payloadToGetUserBlockByIdInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
  actorUserId: string,
): IGetUserBlockByIdApplicationInput {
  return {
    id,
    isStaffUser,
    actorUserId,
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(queryPayload.preset, isStaffUser)),
    },
  };
}
