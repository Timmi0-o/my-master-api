import type { IGetMasterServiceReviewByIdApplicationInput } from 'src/modules/masters/application/dtos/master-service-review/get-master-service-review-by-id.input';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function requestQueryParamsToGetMasterServiceReviewByIdUseCaseInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
  viewerUserId?: string,
): IGetMasterServiceReviewByIdApplicationInput {
  return {
    id,
    isStaffUser,
    viewerUserId,
    params: {
      ...splitPresetReadOptions(
        presetToSelectOptions(queryPayload.preset, isStaffUser),
      ),
    },
  };
}
