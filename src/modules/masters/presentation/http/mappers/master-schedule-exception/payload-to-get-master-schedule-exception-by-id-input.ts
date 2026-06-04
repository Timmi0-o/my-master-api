import type { IGetMasterScheduleExceptionByIdApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/get-master-schedule-exception-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { toMasterActor } from '../shared/to-master-actor';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetMasterScheduleExceptionByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMasterScheduleExceptionByIdApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
    params: {
      selectOptions: presetToSelectOptions(query.preset, isStaffUser),
    },
  };
}
