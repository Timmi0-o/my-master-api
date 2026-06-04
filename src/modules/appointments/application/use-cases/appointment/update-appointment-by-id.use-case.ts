import type { IUpdateAppointmentApplicationInput } from '../../dtos/appointment/update-appointment.input';
import type { IAppointmentEntity } from 'src/modules/appointments/domain/entities/appointment';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class UpdateAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateAppointmentApplicationInput,
  ): Promise<IAppointmentEntity> {
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

    return this.appointmentRepository.update(input.id, input.patch);
  }
}
