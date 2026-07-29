import type { IAssertAppointmentChatAccessApplicationInput } from '../../dtos/appointment-chat/assert-appointment-chat-access.input';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class AssertAppointmentChatAccessUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IAssertAppointmentChatAccessApplicationInput,
  ): Promise<void> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);
  }
}
