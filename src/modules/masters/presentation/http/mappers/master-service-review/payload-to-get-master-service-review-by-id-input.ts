import type { IGetMasterServiceReviewByIdApplicationInput } from 'src/modules/masters/application/dtos/master-service-review/get-master-service-review-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetMasterServiceReviewByIdInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
): IGetMasterServiceReviewByIdApplicationInput {
  return {
    id,
    isStaffUser,
    params: {
      selectOptions: presetToSelectOptions(queryPayload.preset, isStaffUser),
    },
  };
}
