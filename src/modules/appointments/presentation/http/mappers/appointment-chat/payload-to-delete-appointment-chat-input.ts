import type { IDeleteAppointmentChatApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/delete-appointment-chat.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToDeleteAppointmentChatInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteAppointmentChatApplicationInput {
  return { id, actor: toAppointmentActor(sessionUser, isStaffUser) };
}
