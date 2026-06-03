import type { IGetMasterServiceByIdApplicationInput } from 'src/modules/masters/application/dtos/master-service/get-master-service-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { masterServicePresetToSelectOptions } from './preset-to-select-options.mapper';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToGetMasterServiceByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMasterServiceByIdApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
    params: {
      selectOptions: masterServicePresetToSelectOptions(
        query.preset,
        isStaffUser,
      ),
    },
  };
}
