import type { IGetMasterSubscriptionByIdApplicationInput } from 'src/modules/masters/application/dtos/master-subscription/get-master-subscription-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToGetMasterSubscriptionByIdUseCaseInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
): IGetMasterSubscriptionByIdApplicationInput {
  return {
    id,
    isStaffUser,
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(queryPayload.preset, isStaffUser)),
    },
  };
}
