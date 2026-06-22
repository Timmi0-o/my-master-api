import type { IAssertAppointmentChatAccessApplicationInput } from '../../dtos/appointment-chat/assert-appointment-chat-access.input';
import {
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  ensureAppointmentAccessible,
  ensureAppointmentExists,
} from 'src/modules/appointments/domain/entities/appointment';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class AssertAppointmentChatAccessUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IAssertAppointmentChatAccessApplicationInput): Promise<void> {
    const chat = await this.appointmentChatRepository.findEntityById(input.chatId);
    ensureAppointmentChatExists(chat, input.chatId);

    const appointment = await this.appointmentRepository.findEntityById(
      chat.appointmentId,
    );
    ensureAppointmentExists(appointment, chat.appointmentId);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);
    ensureAppointmentAccessible(appointment, input.actor, profile.userId);
  }
}
