import type { IAppointmentChatMessageEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { AppointmentChatMessageForbiddenError } from 'src/modules/appointments/domain/errors/appointment-chat-message-forbidden.error';
import { AppointmentChatNotFoundError } from 'src/modules/appointments/domain/errors/appointment-chat-not-found.error';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ICreateAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.input';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

export class CreateAppointmentChatMessageUseCase {
  constructor(
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimePublisher: IAppointmentChatRealtimePublisher,
  ) {}

  async execute(
    input: ICreateAppointmentChatMessageApplicationInput,
  ): Promise<IAppointmentChatMessageEntity> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    if (!chat) {
      throw new AppointmentChatNotFoundError(input.chatId);
    }

    const appointment = await this.appointmentRepository.findEntityById(
      chat.appointmentId,
    );
    if (!appointment) {
      throw new AppointmentNotFoundError(chat.appointmentId);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(appointment.masterProfileId);
    }

    const isClient = appointment.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    if (!input.actor.isStaffUser && !isClient && !isMaster) {
      throw new AppointmentChatMessageForbiddenError(input.chatId);
    }

    const message = await this.messageRepository.create({
      chatId: input.chatId,
      senderUserId: input.actor.userId,
      body: input.body,
    });

    await this.realtimePublisher.messageCreated(message);

    return message;
  }
}
