import type { IGetFavoriteMasterServiceByIdApplicationInput } from 'src/modules/masters/application/dtos/favorite-master-service/get-favorite-master-service-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetFavoriteMasterServiceByIdInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
): IGetFavoriteMasterServiceByIdApplicationInput {
  return {
    id,
    isStaffUser,
    params: {
      selectOptions: presetToSelectOptions(queryPayload.preset, isStaffUser),
    },
  };
}
