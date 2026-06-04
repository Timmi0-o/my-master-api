import type { IDeleteAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/delete-appointment-chat-message.input';
import { AppointmentChatMessageNotFoundError } from 'src/modules/appointments/domain/errors/appointment-chat-message-not-found.error';
import { AppointmentChatNotFoundError } from 'src/modules/appointments/domain/errors/appointment-chat-not-found.error';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class DeleteAppointmentChatMessageByIdUseCase {
  constructor(
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteAppointmentChatMessageApplicationInput,
  ): Promise<boolean> {
    const message = await this.messageRepository.findEntityById(input.id);
    if (!message) {
      throw new AppointmentChatMessageNotFoundError(input.id);
    }

    const chat = await this.appointmentChatRepository.findEntityById(message.chatId);
    if (!chat) {
      throw new AppointmentChatNotFoundError(message.chatId);
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

    assertAppointmentAccess(appointment, input.actor, profile.userId);

    return this.messageRepository.softDeleteById(input.id);
  }
}
