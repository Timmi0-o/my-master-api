import type { ICreateAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.input';
import type { ICreateAppointmentChatMessageApplicationOutput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.output';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  AppointmentChatMessageForbiddenError,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { ensureAppointmentChatExists } from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  ensureAppointmentExists,
} from 'src/modules/appointments/domain/entities/appointment';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateAppointmentChatMessageUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimePublisher: IAppointmentChatRealtimePublisher,
  ) {}

  async execute(
    input: ICreateAppointmentChatMessageApplicationInput,
  ): Promise<ICreateAppointmentChatMessageApplicationOutput> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const appointment = await this.appointmentRepository.findEntityById(
      chat.appointmentId,
    );
    ensureAppointmentExists(appointment, chat.appointmentId);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);

    const isClient = appointment.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    if (!input.actor.isStaffUser && !isClient && !isMaster) {
      throw new AppointmentChatMessageForbiddenError(input.chatId);
    }

    const createInput: ICreateAppointmentChatMessageInput = {
      chatId: input.chatId,
      senderUserId: input.actor.userId,
      body: input.body,
    };

    const message = await this.transactionManager.runInTransaction((scope) =>
      this.messageRepository.create(createInput, scope),
    );

    await this.realtimePublisher.messageCreated(message);

    return message;
  }
}
