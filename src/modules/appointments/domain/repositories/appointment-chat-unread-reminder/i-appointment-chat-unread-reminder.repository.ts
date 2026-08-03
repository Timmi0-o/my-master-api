import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IAppointmentChatUnreadReminderEntity,
  ICreateAppointmentChatUnreadReminderInput,
} from '../../entities/appointment-chat-unread-reminder';

export type IStaleUnreadAppointmentChatPair = {
  chatId: string;
  recipientProfileUserId: string;
  /** Counterparty who sent the unread messages (master or client userId). */
  senderUserId: string;
  /** True when recipient is the chat client; false when recipient is the master. */
  recipientIsClient: boolean;
  oldestUnreadAt: Date;
};

export type IAppointmentChatUnreadReminderRepository = {
  findByChatIdAndRecipientProfileUserId(
    chatId: string,
    recipientProfileUserId: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity | null>;

  create(
    input: ICreateAppointmentChatUnreadReminderInput,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity>;

  incrementRemindersCountById(
    id: string,
    lastRemindedAt: Date,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity>;

  deleteByAppointmentChatUnreadReminderId(
    id: string,
    scope?: TransactionScope,
  ): Promise<void>;

  deleteByChatIdAndRecipientProfileUserId(
    chatId: string,
    recipientProfileUserId: string,
    scope?: TransactionScope,
  ): Promise<void>;

  /**
   * Pairs (chat × recipient) with oldest incoming USER unread ≥ staleBefore.
   * Active chats only. Limited to `limit` pairs.
   */
  findStaleUnreadAppointmentChatPairs(input: {
    staleBefore: Date;
    limit: number;
  }): Promise<IStaleUnreadAppointmentChatPair[]>;
};
