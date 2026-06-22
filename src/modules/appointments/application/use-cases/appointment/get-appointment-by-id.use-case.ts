import type { IGetAppointmentByIdApplicationInput } from '../../dtos/appointment/get-appointment-by-id.input';
import type { IGetAppointmentByIdApplicationOutput } from '../../dtos/appointment/get-appointment-by-id.output';
import {
  AppointmentNotFoundError,
  ensureAppointmentAccessible,
} from 'src/modules/appointments/domain/entities/appointment';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class GetAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetAppointmentByIdApplicationInput,
  ): Promise<IGetAppointmentByIdApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    if (!existing || (!input.actor.isStaffUser && existing.deletedAt != null)) {
      throw new AppointmentNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);

    const item = await this.appointmentRepository.findOne(input.id, input.params);
    if (!item) {
      throw new AppointmentNotFoundError(input.id);
    }
    return item;
  }
}
