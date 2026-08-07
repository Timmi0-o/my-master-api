import type { IAppointmentChatMessageEntity } from '../i-appointment-chat-message.entity';
import { EAppointmentChatMessageActor } from '../appointment-chat-message.enum';
import { AppointmentChatMessageReplyTargetInvalidError } from '../errors';

/**
 * Reply target must be a visible USER message in the same chat.
 */
export function ensureAppointmentChatMessageReplyable(input: {
  chatId: string;
  replyToMessageId: string;
  replyTarget: IAppointmentChatMessageEntity | null;
  actorUserId: string;
}): asserts input is {
  chatId: string;
  replyToMessageId: string;
  replyTarget: IAppointmentChatMessageEntity;
  actorUserId: string;
} {
  const { chatId, replyToMessageId, replyTarget, actorUserId } = input;

  if (!replyTarget) {
    throw new AppointmentChatMessageReplyTargetInvalidError(
      replyToMessageId,
      'NOT_FOUND',
    );
  }

  if (replyTarget.chatId !== chatId) {
    throw new AppointmentChatMessageReplyTargetInvalidError(
      replyToMessageId,
      'DIFFERENT_CHAT',
    );
  }

  if (replyTarget.actor !== EAppointmentChatMessageActor.USER) {
    throw new AppointmentChatMessageReplyTargetInvalidError(
      replyToMessageId,
      'NOT_USER_MESSAGE',
    );
  }

  if (replyTarget.deletedAt != null) {
    throw new AppointmentChatMessageReplyTargetInvalidError(
      replyToMessageId,
      'ALREADY_DELETED',
    );
  }

  if (replyTarget.deletedForUserIds.includes(actorUserId)) {
    throw new AppointmentChatMessageReplyTargetInvalidError(
      replyToMessageId,
      'DELETED_FOR_ACTOR',
    );
  }
}
