import type { IGetAppointmentChatByIdApplicationInput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.input';
import type { IGetAppointmentChatByIdApplicationOutput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.output';
import {
  AppointmentChatNotFoundError,
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

export class GetAppointmentChatByIdUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IGetAppointmentChatByIdApplicationInput): Promise<IGetAppointmentChatByIdApplicationOutput> {
    const existing = await this.appointmentChatRepository.findEntityById(input.id);
    ensureAppointmentChatExists(existing, input.id);

    const appointment = await this.appointmentRepository.findEntityById(
      existing.appointmentId,
    );
    ensureAppointmentExists(appointment, existing.appointmentId);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);
    ensureAppointmentAccessible(appointment, input.actor, profile.userId);

    const item = await this.appointmentChatRepository.findOne(input.id, input.params);
    if (!item) {
      throw new AppointmentChatNotFoundError(input.id);
    }
    return item;
  }
}
