import type { IDeleteAppointmentApplicationInput } from '../../dtos/appointment/delete-appointment.input';
import type { IDeleteAppointmentApplicationOutput } from '../../dtos/appointment/delete-appointment.output';
import {
  ensureAppointmentAccessible,
  ensureAppointmentExists,
} from 'src/modules/appointments/domain/entities/appointment';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteAppointmentByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteAppointmentApplicationInput,
  ): Promise<IDeleteAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);

    return this.transactionManager.runInTransaction((scope) =>
      this.appointmentRepository.softDelete(input.id, scope),
    );
  }
}
