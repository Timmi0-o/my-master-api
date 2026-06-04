import type { IGetAppointmentChatByIdApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chat-by-id.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToGetAppointmentChatByIdInput(
  id: string,
  query: IGetByIdQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetAppointmentChatByIdApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
    params: { selectOptions: presetToSelectOptions(query.preset, isStaffUser) },
  };
}
