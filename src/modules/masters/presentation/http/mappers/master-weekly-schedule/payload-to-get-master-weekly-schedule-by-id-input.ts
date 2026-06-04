import type { IGetMasterWeeklyScheduleByIdApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/get-master-weekly-schedule-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { toMasterActor } from '../shared/to-master-actor';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetMasterWeeklyScheduleByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMasterWeeklyScheduleByIdApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
    params: {
      selectOptions: presetToSelectOptions(query.preset, isStaffUser),
    },
  };
}
