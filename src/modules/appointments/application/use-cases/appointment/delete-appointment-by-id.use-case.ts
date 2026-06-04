import type { IDeleteAppointmentApplicationInput } from '../../dtos/appointment/delete-appointment.input';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class DeleteAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IDeleteAppointmentApplicationInput): Promise<boolean> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    if (!existing) {
      throw new AppointmentNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(existing.masterProfileId);
    }

    assertAppointmentAccess(existing, input.actor, profile.userId);

    return this.appointmentRepository.softDeleteById(input.id);
  }
}
