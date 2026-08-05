import type { IAppointmentChatMessageEntity } from '../i-appointment-chat-message.entity';
import { EAppointmentChatMessageActor } from '../appointment-chat-message.enum';
import { AppointmentChatMessageNotEditableError } from '../errors';
import { APPOINTMENT_CHAT_MESSAGE_EDIT_WINDOW_MS } from './appointment-chat-message.constants';

type IEditableActor = {
  userId: string;
  isStaffUser?: boolean;
};

/**
 * Sender may edit own USER message within the edit window; body must be non-empty.
 */
export function ensureAppointmentChatMessageEditable(
  message: IAppointmentChatMessageEntity,
  actor: IEditableActor,
  nextBody: string,
  now: Date = new Date(),
): void {
  if (message.actor !== EAppointmentChatMessageActor.USER) {
    throw new AppointmentChatMessageNotEditableError(
      message.id,
      'NOT_USER_MESSAGE',
    );
  }

  if (message.senderUserId !== actor.userId) {
    throw new AppointmentChatMessageNotEditableError(message.id, 'NOT_OWNER');
  }

  if (message.deletedAt != null) {
    throw new AppointmentChatMessageNotEditableError(
      message.id,
      'ALREADY_DELETED',
    );
  }

  if (message.deletedForUserIds.includes(actor.userId)) {
    throw new AppointmentChatMessageNotEditableError(
      message.id,
      'DELETED_FOR_ACTOR',
    );
  }

  const ageMs = now.getTime() - message.createdAt.getTime();
  if (ageMs > APPOINTMENT_CHAT_MESSAGE_EDIT_WINDOW_MS) {
    throw new AppointmentChatMessageNotEditableError(
      message.id,
      'EDIT_WINDOW_EXPIRED',
    );
  }

  if (nextBody.trim().length === 0) {
    throw new AppointmentChatMessageNotEditableError(
      message.id,
      'EMPTY_BODY',
    );
  }
}
