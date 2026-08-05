import type { IDeleteAppointmentChatMessageApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat-message/delete-appointment-chat-message.input';
import { EAppointmentChatMessageDeleteMode } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteAppointmentChatMessageQueryPayload } from '../../validation/schemas/delete-appointment-chat-message-query.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestToDeleteAppointmentChatMessageUseCaseInput(
  id: string,
  query: IDeleteAppointmentChatMessageQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteAppointmentChatMessageApplicationInput {
  const mode =
    query.mode === 'FOR_ME'
      ? EAppointmentChatMessageDeleteMode.FOR_ME
      : EAppointmentChatMessageDeleteMode.FOR_EVERYONE;

  return {
    id,
    mode,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
