import type { IEditAppointmentChatMessageApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat-message/edit-appointment-chat-message.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IEditAppointmentChatMessagePayload } from '../../validation/schemas/edit-appointment-chat-message-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestBodyToEditAppointmentChatMessageUseCaseInput(
  id: string,
  payload: IEditAppointmentChatMessagePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IEditAppointmentChatMessageApplicationInput {
  return {
    id,
    body: payload.body,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
