import type { IDeleteAppointmentChatApplicationInput } from '../../dtos/appointment-chat/delete-appointment-chat.input';
import type { IDeleteAppointmentChatApplicationOutput } from '../../dtos/appointment-chat/delete-appointment-chat.output';
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
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteAppointmentChatByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteAppointmentChatApplicationInput,
  ): Promise<IDeleteAppointmentChatApplicationOutput> {
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

    return this.transactionManager.runInTransaction((scope) =>
      this.appointmentChatRepository.softDelete(input.id, scope),
    );
  }
}
