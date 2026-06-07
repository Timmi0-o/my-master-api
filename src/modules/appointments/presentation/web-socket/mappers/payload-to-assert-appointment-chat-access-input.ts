import type { IAssertAppointmentChatAccessApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/assert-appointment-chat-access.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { EUserRole } from 'src/modules/users/domain/entities/user';
import { toAppointmentActor } from '../../http/mappers/shared/to-appointment-actor';
import type { IJoinAppointmentChatPayload } from '../validation/schemas/join-appointment-chat-payload.types';

function resolveIsStaffUser(sessionUser: ISessionUser): boolean {
  return (
    sessionUser.role === EUserRole.ADMIN ||
    sessionUser.role === EUserRole.SUPER_ADMIN
  );
}

export function payloadToAssertAppointmentChatAccessInput(
  payload: IJoinAppointmentChatPayload,
  sessionUser: ISessionUser,
): IAssertAppointmentChatAccessApplicationInput {
  return {
    chatId: payload.chatId,
    actor: toAppointmentActor(sessionUser, resolveIsStaffUser(sessionUser)),
  };
}
