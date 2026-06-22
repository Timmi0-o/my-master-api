import type { IGetAppointmentChatMessageByIdApplicationInput } from '../../dtos/appointment-chat-message/get-appointment-chat-message-by-id.input';
import type { IGetAppointmentChatMessageByIdApplicationOutput } from '../../dtos/appointment-chat-message/get-appointment-chat-message-by-id.output';
import {
  AppointmentChatMessageNotFoundError,
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

export class GetAppointmentChatMessageByIdUseCase {
  constructor(
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetAppointmentChatMessageByIdApplicationInput,
  ): Promise<IGetAppointmentChatMessageByIdApplicationOutput> {
    const message = await this.messageRepository.findEntityById(input.id);
    if (!message || (!input.actor.isStaffUser && message.deletedAt != null)) {
      throw new AppointmentChatMessageNotFoundError(input.id);
    }

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

    const item = await this.messageRepository.findOne(input.id, input.params);
    if (!item) {
      throw new AppointmentChatMessageNotFoundError(input.id);
    }
    return item;
  }
}
