import type { IAppointmentChatMessageEntity } from '../i-appointment-chat-message.entity';
import { EAppointmentChatMessageActor } from '../appointment-chat-message.enum';
import { AppointmentChatMessageNotDeletableError } from '../errors';

type IDeletableActor = {
  userId: string;
  isStaffUser?: boolean;
};

/**
 * Sender may delete own USER message that is not already deleted for everyone.
 */
export function ensureAppointmentChatMessageDeletable(
  message: IAppointmentChatMessageEntity,
  actor: IDeletableActor,
): void {
  if (message.actor !== EAppointmentChatMessageActor.USER) {
    throw new AppointmentChatMessageNotDeletableError(
      message.id,
      'NOT_USER_MESSAGE',
    );
  }

  if (message.senderUserId !== actor.userId) {
    throw new AppointmentChatMessageNotDeletableError(message.id, 'NOT_OWNER');
  }

  if (message.deletedAt != null) {
    throw new AppointmentChatMessageNotDeletableError(
      message.id,
      'ALREADY_DELETED',
    );
  }
}
