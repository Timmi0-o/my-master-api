import type { IGetMyInProgressAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/get-my-in-progress-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToGetMyInProgressAppointmentUseCaseInput(
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyInProgressAppointmentApplicationInput {
  return {
    actor: toAppointmentActor(sessionUser, isStaffUser),
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(query.preset, isStaffUser)),
    },
  };
}
