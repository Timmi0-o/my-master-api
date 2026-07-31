import type { TransactionScope } from '@shared/domain/transactions';
import {
  buildAppointmentReminderJobPlans,
  type IAppointmentReminderJobEntity,
} from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';

export class ScheduleAppointmentRemindersUseCase {
  constructor(
    private readonly appointmentReminderJobRepository: IAppointmentReminderJobRepository,
  ) {}

  async execute(input: {
    appointmentId: string;
    startsAt: Date;
    now?: Date;
    scope?: TransactionScope;
  }): Promise<IAppointmentReminderJobEntity[]> {
    const plans = buildAppointmentReminderJobPlans(
      input.startsAt,
      input.now ?? new Date(),
    );

    return this.appointmentReminderJobRepository.upsertPendingMany(
      plans.map((plan) => ({
        appointmentId: input.appointmentId,
        type: plan.type,
        runAt: plan.runAt,
      })),
      input.scope,
    );
  }
}
