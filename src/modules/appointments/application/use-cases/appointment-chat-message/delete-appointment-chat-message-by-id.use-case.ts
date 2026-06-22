import type { IDeleteAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/delete-appointment-chat-message.input';
import type { IDeleteAppointmentChatMessageApplicationOutput } from '../../dtos/appointment-chat-message/delete-appointment-chat-message.output';
import {
  AppointmentChatMessageNotFoundError,
  ensureAppointmentChatMessageExists,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { ensureAppointmentChatExists } from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  ensureAppointmentAccessible,
  ensureAppointmentExists,
} from 'src/modules/appointments/domain/entities/appointment';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteAppointmentChatMessageByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimePublisher: IAppointmentChatRealtimePublisher,
  ) {}

  async execute(
    input: IDeleteAppointmentChatMessageApplicationInput,
  ): Promise<IDeleteAppointmentChatMessageApplicationOutput> {
    const message = await this.messageRepository.findEntityById(input.id);
    ensureAppointmentChatMessageExists(message, input.id);

    const chat = await this.appointmentChatRepository.findEntityById(
      message.chatId,
    );
    ensureAppointmentChatExists(chat, message.chatId);

    const appointment = await this.appointmentRepository.findEntityById(
      chat.appointmentId,
    );
    ensureAppointmentExists(appointment, chat.appointmentId);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);
    ensureAppointmentAccessible(appointment, input.actor, profile.userId);

    const deleted = await this.transactionManager.runInTransaction((scope) =>
      this.messageRepository.softDelete(input.id, scope),
    );

    await this.realtimePublisher.messageDeleted({
      chatId: message.chatId,
      messageId: input.id,
    });

    return deleted;
  }
}
