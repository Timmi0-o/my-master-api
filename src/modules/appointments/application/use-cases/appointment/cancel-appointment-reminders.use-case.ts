import type { TransactionScope } from '@shared/domain/transactions';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';
import type { AppointmentReminderQueueService } from 'src/modules/appointments/infrastructure/queues/appointment-reminder-queue.service';

export class CancelAppointmentRemindersUseCase {
  constructor(
    private readonly appointmentReminderJobRepository: IAppointmentReminderJobRepository,
    private readonly appointmentReminderQueueService?: AppointmentReminderQueueService,
  ) {}

  async execute(input: {
    appointmentId: string;
    scope?: TransactionScope;
  }): Promise<number> {
    const cancelled =
      await this.appointmentReminderJobRepository.cancelActiveByAppointmentId(
        input.appointmentId,
        input.scope,
      );

    await this.appointmentReminderQueueService?.cancelByAppointmentId(
      input.appointmentId,
    );

    return cancelled;
  }
}
