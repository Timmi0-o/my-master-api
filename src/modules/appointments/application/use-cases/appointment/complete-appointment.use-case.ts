import type { ITransactionManager } from '@shared/domain/transactions';
import {
  AppointmentForbiddenError,
  EAppointmentStatus,
  ensureAppointmentAccessible,
  ensureAppointmentCompletable,
  ensureAppointmentExists,
  isAppointmentEarlyCompletion,
  type IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ICompleteAppointmentApplicationInput } from '../../dtos/appointment/complete-appointment.input';
import type { ICompleteAppointmentApplicationOutput } from '../../dtos/appointment/complete-appointment.output';

export class CompleteAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICompleteAppointmentApplicationInput,
  ): Promise<ICompleteAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);
    ensureAppointmentCompletable(existing);

    const isMaster = profile.userId === input.actor.userId;
    const isClient = existing.clientUserId === input.actor.userId;

    if (!input.actor.isStaffUser && !isMaster && !isClient) {
      throw new AppointmentForbiddenError(existing.id);
    }

    // Staff completing without being master/client: treat as master-side completion
    const completingAsMaster =
      isMaster || (input.actor.isStaffUser && !isClient);
    const isEarly = isAppointmentEarlyCompletion(existing);

    const patch: IUpdateAppointmentInput = {
      status: EAppointmentStatus.COMPLETED,
      ...(isEarly && completingAsMaster
        ? { isEarlyCompletionByMaster: true }
        : {}),
      ...(isEarly && isClient && !isMaster
        ? { isEarlyCompletionByClient: true }
        : {}),
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.appointmentRepository.update(input.id, patch, scope),
    );
  }
}
