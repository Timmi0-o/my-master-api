import type { IAssertAppointmentChatAccessApplicationInput } from '../../dtos/appointment-chat/assert-appointment-chat-access.input';
import { AppointmentChatNotFoundError } from 'src/modules/appointments/domain/errors/appointment-chat-not-found.error';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class AssertAppointmentChatAccessUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IAssertAppointmentChatAccessApplicationInput,
  ): Promise<void> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    if (!chat || (!input.actor.isStaffUser && chat.deletedAt != null)) {
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

    assertAppointmentAccess(appointment, input.actor, profile.userId);
  }
}
