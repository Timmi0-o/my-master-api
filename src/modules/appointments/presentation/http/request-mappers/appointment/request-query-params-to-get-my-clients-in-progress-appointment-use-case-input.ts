import type { IGetMyClientsInProgressAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/get-my-clients-in-progress-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToGetMyClientsInProgressAppointmentUseCaseInput(
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyClientsInProgressAppointmentApplicationInput {
  return {
    actor: toAppointmentActor(sessionUser, isStaffUser),
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(query.preset, isStaffUser)),
    },
  };
}
