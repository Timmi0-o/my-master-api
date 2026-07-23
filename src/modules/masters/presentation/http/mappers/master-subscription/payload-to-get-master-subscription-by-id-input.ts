import type { IGetMasterSubscriptionByIdApplicationInput } from 'src/modules/masters/application/dtos/master-subscription/get-master-subscription-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetMasterSubscriptionByIdInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
): IGetMasterSubscriptionByIdApplicationInput {
  return {
    id,
    isStaffUser,
    params: {
      selectOptions: presetToSelectOptions(queryPayload.preset, isStaffUser),
    },
  };
}
