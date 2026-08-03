import type { ITransactionManager } from '@shared/domain/transactions';
import { getAppointmentChatMyLastReadAt } from 'src/modules/appointments/application/helpers/appointment-chat-unread.helper';
import {
  AppointmentChatForbiddenError,
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatUnreadReminderRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-unread-reminder';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMarkAppointmentChatReadApplicationInput } from '../../dtos/appointment-chat/mark-appointment-chat-read.input';
import type { IMarkAppointmentChatReadApplicationOutput } from '../../dtos/appointment-chat/mark-appointment-chat-read.output';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

export class MarkAppointmentChatReadUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatUnreadReminderRepository: IAppointmentChatUnreadReminderRepository,
    private readonly realtimePublisher: IAppointmentChatRealtimePublisher,
  ) {}

  async execute(
    input: IMarkAppointmentChatReadApplicationInput,
  ): Promise<IMarkAppointmentChatReadApplicationOutput> {
    const chat = await this.appointmentChatRepository.findEntityById(input.id);
    ensureAppointmentChatExists(chat, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);

    const isClient = chat.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;

    // Staff who is not a chat participant does not advance cursors.
    if (!isClient && !isMaster) {
      if (input.actor.isStaffUser) {
        return chat;
      }

      throw new AppointmentChatForbiddenError(chat.id);
    }

    const currentCursor = isClient
      ? chat.clientLastReadAt
      : chat.masterLastReadAt;

    if (
      currentCursor != null &&
      input.lastReadAt.getTime() <= currentCursor.getTime()
    ) {
      // Повторно пушим текущие курсоры — отправитель мог пропустить прошлый WS.
      await this.realtimePublisher.chatRead({
        chatId: chat.id,
        clientLastReadAt: chat.clientLastReadAt,
        masterLastReadAt: chat.masterLastReadAt,
      });
      return chat;
    }

    const updated = await this.transactionManager.runInTransaction((scope) =>
      this.appointmentChatRepository.update(
        chat.id,
        isClient
          ? { clientLastReadAt: input.lastReadAt }
          : { masterLastReadAt: input.lastReadAt },
        scope,
      ),
    );

    const myLastReadAt = getAppointmentChatMyLastReadAt(
      updated,
      input.actor.userId,
    );
    const unreadCount =
      await this.appointmentChatMessageRepository.countUnreadForChat({
        chatId: updated.id,
        viewerUserId: input.actor.userId,
        myLastReadAt,
      });

    if (unreadCount === 0) {
      await this.appointmentChatUnreadReminderRepository.deleteByChatIdAndRecipientProfileUserId(
        updated.id,
        input.actor.userId,
      );
    }

    await this.realtimePublisher.chatRead({
      chatId: updated.id,
      clientLastReadAt: updated.clientLastReadAt,
      masterLastReadAt: updated.masterLastReadAt,
    });

    return updated;
  }
}
