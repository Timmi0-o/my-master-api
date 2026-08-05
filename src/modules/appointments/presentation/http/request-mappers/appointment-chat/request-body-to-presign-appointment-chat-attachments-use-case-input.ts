import type { IPresignAppointmentChatAttachmentsApplicationInput } from 'src/modules/appointments/application/dtos/appointment-chat/presign-appointment-chat-attachments.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignAppointmentChatAttachmentsPayload } from '../../validation/schemas/presign-appointment-chat-attachments-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestBodyToPresignAppointmentChatAttachmentsUseCaseInput(
  chatId: string,
  payload: IPresignAppointmentChatAttachmentsPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IPresignAppointmentChatAttachmentsApplicationInput {
  return {
    chatId,
    files: payload.files,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
