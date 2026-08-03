import { ScheduleAppointmentRemindersUseCase } from 'src/modules/appointments/application/use-cases/appointment/schedule-appointment-reminders.use-case';
import { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

describe('ScheduleAppointmentRemindersUseCase', () => {
  it('upserts only future reminder plans', async () => {
    const now = new Date('2026-08-01T12:00:00.000Z');
    const startsAt = new Date(now.getTime() + 3 * MS_PER_HOUR);
    const upsertPendingMany = jest.fn().mockResolvedValue([]);
    const syncDelayedJobs = jest.fn().mockResolvedValue(undefined);

    const useCase = new ScheduleAppointmentRemindersUseCase(
      {
        upsertPendingMany,
      } as unknown as IAppointmentReminderJobRepository,
      { syncDelayedJobs } as never,
    );

    await useCase.execute({
      appointmentId: 'appt-1',
      startsAt,
      now,
    });

    expect(upsertPendingMany).toHaveBeenCalledWith(
      [
        {
          appointmentId: 'appt-1',
          type: EAppointmentReminderJobType.REMINDER_2H,
          runAt: new Date(startsAt.getTime() - 2 * MS_PER_HOUR),
        },
        {
          appointmentId: 'appt-1',
          type: EAppointmentReminderJobType.REMINDER_30M,
          runAt: new Date(startsAt.getTime() - 30 * MS_PER_MINUTE),
        },
      ],
      undefined,
    );
    expect(syncDelayedJobs).toHaveBeenCalledWith([]);
  });
});
