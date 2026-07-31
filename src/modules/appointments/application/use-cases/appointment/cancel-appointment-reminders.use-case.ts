import type { TransactionScope } from '@shared/domain/transactions';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';

export class CancelAppointmentRemindersUseCase {
  constructor(
    private readonly appointmentReminderJobRepository: IAppointmentReminderJobRepository,
  ) {}

  async execute(input: {
    appointmentId: string;
    scope?: TransactionScope;
  }): Promise<number> {
    return this.appointmentReminderJobRepository.cancelActiveByAppointmentId(
      input.appointmentId,
      input.scope,
    );
  }
}
