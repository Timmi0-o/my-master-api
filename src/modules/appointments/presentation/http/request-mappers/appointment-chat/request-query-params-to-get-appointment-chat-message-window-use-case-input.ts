import type { IGetAppointmentChatMessageWindowApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chat-message-window.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toAppointmentActor } from '../shared/to-appointment-actor';
import type { IGetAppointmentChatMessageWindowQueryPayload } from '../../validation/schemas/get-appointment-chat-message-window-query.types';

export function requestQueryParamsToGetAppointmentChatMessageWindowUseCaseInput(
  chatId: string,
  query: IGetAppointmentChatMessageWindowQueryPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetAppointmentChatMessageWindowApplicationInput {
  return {
    actor: toAppointmentActor(sessionUser, isStaffUser),
    chatId,
    limit: query.limit ?? 40,
    beforeCreatedAt: query.beforeCreatedAt
      ? new Date(query.beforeCreatedAt)
      : undefined,
    beforeId: query.beforeId,
    afterCreatedAt: query.afterCreatedAt
      ? new Date(query.afterCreatedAt)
      : undefined,
    afterId: query.afterId,
  };
}
