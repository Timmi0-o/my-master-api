import type { IMarkAppointmentChatReadApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/mark-appointment-chat-read.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';
import type { IMarkAppointmentChatReadPayload } from '../../validation/schemas/mark-appointment-chat-read-payload.types';

export function requestBodyToMarkAppointmentChatReadUseCaseInput(
  id: string,
  payload: IMarkAppointmentChatReadPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IMarkAppointmentChatReadApplicationInput {
  return {
    id,
    lastReadAt: new Date(payload.lastReadAt),
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
