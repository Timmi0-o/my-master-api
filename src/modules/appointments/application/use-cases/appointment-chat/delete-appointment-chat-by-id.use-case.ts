import type { IDeleteAppointmentChatApplicationInput } from '../../dtos/appointment-chat/delete-appointment-chat.input';
import { AppointmentChatNotFoundError } from 'src/modules/appointments/domain/errors/appointment-chat-not-found.error';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class DeleteAppointmentChatByIdUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IDeleteAppointmentChatApplicationInput): Promise<boolean> {
    const chat = await this.appointmentChatRepository.findEntityById(input.id);
    if (!chat) {
      throw new AppointmentChatNotFoundError(input.id);
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

    return this.appointmentChatRepository.softDeleteById(input.id);
  }
}
