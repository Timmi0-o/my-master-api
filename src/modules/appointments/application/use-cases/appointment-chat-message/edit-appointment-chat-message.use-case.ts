import type { ITransactionManager } from '@shared/domain/transactions';
import { ensureChatHasActiveAppointment } from '@modules/appointments/domain/entities/appointment/policies/ensure-chat-has-active-appointment.policy';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  ensureAppointmentChatMessageEditable,
  ensureAppointmentChatMessageExists,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IEditAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/edit-appointment-chat-message.input';
import type { IEditAppointmentChatMessageApplicationOutput } from '../../dtos/appointment-chat-message/edit-appointment-chat-message.output';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

export class EditAppointmentChatMessageUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimePublisher: IAppointmentChatRealtimePublisher,
  ) {}

  async execute(
    input: IEditAppointmentChatMessageApplicationInput,
  ): Promise<IEditAppointmentChatMessageApplicationOutput> {
    const message = await this.messageRepository.findEntityById(input.id);
    ensureAppointmentChatMessageExists(message, input.id);

    const chat = await this.appointmentChatRepository.findEntityById(
      message.chatId,
    );
    ensureAppointmentChatExists(chat, message.chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);

    const appointments = await this.appointmentRepository.findMany({
      where: { chatId: chat.id },
    });
    ensureChatHasActiveAppointment(appointments, chat.id);

    const nextBody = input.body.trim();
    ensureAppointmentChatMessageEditable(message, input.actor, nextBody);

    const now = new Date();
    const editedHistory =
      message.body != null && message.body !== nextBody
        ? [...message.editedHistory, message.body]
        : message.editedHistory;

    const updated = await this.transactionManager.runInTransaction((scope) =>
      this.messageRepository.update(
        input.id,
        {
          body: nextBody,
          editedAt: now,
          editedHistory,
        },
        scope,
      ),
    );

    await this.realtimePublisher.messageUpdated(updated);

    return updated;
  }
}
