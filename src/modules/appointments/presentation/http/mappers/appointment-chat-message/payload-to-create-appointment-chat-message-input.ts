import type { ICreateAppointmentChatMessageApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat-message/create-appointment-chat-message.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateAppointmentChatMessagePayload } from '../../validation/schemas/create-appointment-chat-message-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToCreateAppointmentChatMessageInput(
  payload: ICreateAppointmentChatMessagePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateAppointmentChatMessageApplicationInput {
  return {
    chatId: payload.chatId,
    body: payload.body,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
