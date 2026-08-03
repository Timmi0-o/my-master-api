import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { CompleteAppointmentUseCase } from './complete-appointment.use-case';

const AUTO_COMPLETE_BATCH_LIMIT = 50;
const SYSTEM_ACTOR_USER_ID = '00000000-0000-0000-0000-000000000000';

export class CronProcessDueAppointmentAutoCompletionsUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly completeAppointmentUseCase: CompleteAppointmentUseCase,
  ) {}

  async execute(now: Date = new Date()): Promise<{ processed: number }> {
    const due =
      await this.appointmentRepository.findConfirmedDueForAutoComplete(
        now,
        AUTO_COMPLETE_BATCH_LIMIT,
      );

    let processed = 0;

    for (const appointment of due) {
      try {
        await this.completeAppointmentUseCase.execute({
          id: appointment.id,
          source: 'system',
          actor: {
            userId: SYSTEM_ACTOR_USER_ID,
            isStaffUser: true,
          },
        });
        processed += 1;
      } catch {
        // Continue batch — next cron will retry remaining
      }
    }

    return { processed };
  }
}
