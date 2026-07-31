import { ScheduleAppointmentRemindersUseCase } from 'src/modules/appointments/application/use-cases/appointment/schedule-appointment-reminders.use-case';
import { CancelAppointmentRemindersUseCase } from 'src/modules/appointments/application/use-cases/appointment/cancel-appointment-reminders.use-case';
import { ProcessDueAppointmentRemindersUseCase } from 'src/modules/appointments/application/use-cases/appointment/process-due-appointment-reminders.use-case';
import {
  EAppointmentReminderJobStatus,
  EAppointmentReminderJobType,
  buildAppointmentReminderJobPlans,
} from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

describe('buildAppointmentReminderJobPlans', () => {
  const now = new Date('2026-08-01T12:00:00.000Z');

  it('schedules all reminders when startsAt is more than 48h ahead', () => {
    const startsAt = new Date(now.getTime() + 60 * MS_PER_HOUR);
    const plans = buildAppointmentReminderJobPlans(startsAt, now);

    expect(plans.map((p) => p.type)).toEqual([
      EAppointmentReminderJobType.REMINDER_48H,
      EAppointmentReminderJobType.REMINDER_24H,
      EAppointmentReminderJobType.REMINDER_12H,
      EAppointmentReminderJobType.REMINDER_6H,
      EAppointmentReminderJobType.REMINDER_4H,
      EAppointmentReminderJobType.REMINDER_2H,
      EAppointmentReminderJobType.REMINDER_30M,
    ]);
  });

  it('schedules only remaining offsets when startsAt is between 2h and 4h', () => {
    const startsAt = new Date(now.getTime() + 3 * MS_PER_HOUR);
    const plans = buildAppointmentReminderJobPlans(startsAt, now);

    expect(plans.map((p) => p.type)).toEqual([
      EAppointmentReminderJobType.REMINDER_2H,
      EAppointmentReminderJobType.REMINDER_30M,
    ]);
  });

  it('schedules only REMINDER_30M when startsAt is between 30m and 2h', () => {
    const startsAt = new Date(now.getTime() + 60 * MS_PER_MINUTE);
    const plans = buildAppointmentReminderJobPlans(startsAt, now);

    expect(plans).toHaveLength(1);
    expect(plans[0].type).toBe(EAppointmentReminderJobType.REMINDER_30M);
  });

  it('schedules no jobs when startsAt is less than 30m ahead', () => {
    const startsAt = new Date(now.getTime() + 15 * MS_PER_MINUTE);
    const plans = buildAppointmentReminderJobPlans(startsAt, now);

    expect(plans).toHaveLength(0);
  });
});

describe('ScheduleAppointmentRemindersUseCase', () => {
  it('upserts only future reminder plans', async () => {
    const now = new Date('2026-08-01T12:00:00.000Z');
    const startsAt = new Date(now.getTime() + 3 * MS_PER_HOUR);
    const upsertPendingMany = jest.fn().mockResolvedValue([]);

    const useCase = new ScheduleAppointmentRemindersUseCase({
      upsertPendingMany,
    } as unknown as IAppointmentReminderJobRepository);

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
  });
});

describe('CancelAppointmentRemindersUseCase', () => {
  it('cancels active reminder jobs for appointment', async () => {
    const cancelActiveByAppointmentId = jest.fn().mockResolvedValue(2);

    const useCase = new CancelAppointmentRemindersUseCase({
      cancelActiveByAppointmentId,
    } as unknown as IAppointmentReminderJobRepository);

    const count = await useCase.execute({ appointmentId: 'appt-1' });

    expect(count).toBe(2);
    expect(cancelActiveByAppointmentId).toHaveBeenCalledWith(
      'appt-1',
      undefined,
    );
  });
});

describe('ProcessDueAppointmentRemindersUseCase', () => {
  const now = new Date('2026-08-01T12:00:00.000Z');

  function createJob(
    overrides: Record<string, unknown> = {},
  ) {
    return {
      id: 'job-1',
      appointmentId: 'appt-1',
      type: EAppointmentReminderJobType.REMINDER_2H,
      runAt: new Date('2026-08-01T11:00:00.000Z'),
      status: EAppointmentReminderJobStatus.PROCESSING,
      attempts: 0,
      lastError: null,
      sentAt: null,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  function createConfirmedAppointment(
    overrides: Record<string, unknown> = {},
  ) {
    return {
      id: 'appt-1',
      masterProfileId: 'mp-1',
      clientUserId: 'client-1',
      serviceName: 'Haircut',
      status: EAppointmentStatus.CONFIRMED,
      startsAt: new Date(now.getTime() + 2 * MS_PER_HOUR),
      deletedAt: null,
      ...overrides,
    };
  }

  it('cancels job when appointment is not CONFIRMED', async () => {
    const claimDueBatch = jest.fn().mockResolvedValue([createJob()]);
    const markCancelled = jest.fn().mockResolvedValue(createJob({
      status: EAppointmentReminderJobStatus.CANCELLED,
    }));
    const createNotification = jest.fn();
    const sendWebPush = jest.fn();

    const useCase = new ProcessDueAppointmentRemindersUseCase(
      {
        claimDueBatch,
        markCancelled,
      } as unknown as IAppointmentReminderJobRepository,
      {
        findEntityById: jest.fn().mockResolvedValue(
          createConfirmedAppointment({ status: EAppointmentStatus.PENDING }),
        ),
      } as unknown as IAppointmentRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as unknown as IMasterProfileRepository,
      { execute: createNotification } as never,
      { execute: sendWebPush } as never,
    );

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      processed: 1,
      sent: 0,
      cancelled: 1,
      failed: 0,
    });
    expect(markCancelled).toHaveBeenCalledWith('job-1');
    expect(createNotification).not.toHaveBeenCalled();
    expect(sendWebPush).not.toHaveBeenCalled();
  });

  it('notifies client and master with stable idempotency keys', async () => {
    const claimDueBatch = jest.fn().mockResolvedValue([createJob()]);
    const markSent = jest.fn().mockResolvedValue(
      createJob({ status: EAppointmentReminderJobStatus.SENT }),
    );
    const createNotification = jest.fn().mockResolvedValue({ id: 'n-1' });
    const sendWebPush = jest.fn().mockResolvedValue({
      attempted: 0,
      succeeded: 0,
      failed: 0,
      expired: 0,
    });

    const useCase = new ProcessDueAppointmentRemindersUseCase(
      {
        claimDueBatch,
        markSent,
      } as unknown as IAppointmentReminderJobRepository,
      {
        findEntityById: jest.fn().mockResolvedValue(createConfirmedAppointment()),
      } as unknown as IAppointmentRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as unknown as IMasterProfileRepository,
      { execute: createNotification } as never,
      { execute: sendWebPush } as never,
    );

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      processed: 1,
      sent: 1,
      cancelled: 0,
      failed: 0,
    });
    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'client-1',
        type: NotificationType.APPOINTMENT_REMINDER,
        idempotencyKey: 'appointment_reminder:appt-1:REMINDER_2H:client-1',
      }),
    );
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'master-1',
        type: NotificationType.APPOINTMENT_REMINDER,
        idempotencyKey: 'appointment_reminder:appt-1:REMINDER_2H:master-1',
      }),
    );
    expect(sendWebPush).toHaveBeenCalledTimes(2);
    expect(markSent).toHaveBeenCalledWith('job-1', now);
  });
});
