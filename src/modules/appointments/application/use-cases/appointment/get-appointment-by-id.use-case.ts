import type { IGetAppointmentByIdApplicationInput } from '../../dtos/appointment/get-appointment-by-id.input';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';
import { AppointmentNotFoundError } from 'src/modules/appointments/domain/errors/appointment-not-found.error';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { assertAppointmentAccess } from '../../helpers/assert-appointment-access';

export class GetAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetAppointmentByIdApplicationInput,
  ): Promise<IAppointmentPublicEntity> {
    const entity = await this.appointmentRepository.findEntityById(input.id);
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new AppointmentNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      entity.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(entity.masterProfileId);
    }

    assertAppointmentAccess(entity, input.actor, profile.userId);

    const item = await this.appointmentRepository.findOne(input.id, input.params);
    if (!item) {
      throw new AppointmentNotFoundError(input.id);
    }
    return item;
  }
}
