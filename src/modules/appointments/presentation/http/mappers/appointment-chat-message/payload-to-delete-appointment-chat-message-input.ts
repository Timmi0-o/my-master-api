import type { IDeleteAppointmentChatMessageApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat-message/delete-appointment-chat-message.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToDeleteAppointmentChatMessageInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteAppointmentChatMessageApplicationInput {
  return { id, actor: toAppointmentActor(sessionUser, isStaffUser) };
}
