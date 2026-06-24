import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import { isStaffRoleIdentifier } from 'src/modules/authorization/domain/policies/is-staff-role-identifier.policy';
import type { IAssertAppointmentChatAccessApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/assert-appointment-chat-access.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../../../http/mappers/shared/to-appointment-actor';
import type { IJoinAppointmentChatPayload } from '../validation/schemas/join-appointment-chat-payload.types';

export function payloadToAssertAppointmentChatAccessInput(
  payload: IJoinAppointmentChatPayload,
  sessionUser: ISessionUser,
): IAssertAppointmentChatAccessApplicationInput {
  return {
    chatId: payload.chatId,
    actor: toAppointmentActor(
      sessionUser,
      isStaffRoleIdentifier(sessionUser.roleIdentifier),
    ),
  };
}
