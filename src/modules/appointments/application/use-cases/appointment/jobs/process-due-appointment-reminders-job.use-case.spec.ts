import { ProcessDueAppointmentRemindersJobUseCase } from 'src/modules/appointments/application/use-cases/appointment/jobs/process-due-appointment-reminders-job.use-case';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import {
  EAppointmentReminderJobStatus,
  EAppointmentReminderJobType,
} from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';

const MS_PER_HOUR = 60 * 60 * 1000;

describe('ProcessDueAppointmentRemindersJobUseCase', () => {
  const now = new Date('2026-08-01T12:00:00.000Z');

  function createJob(overrides: Record<string, unknown> = {}) {
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

  function createConfirmedAppointment(overrides: Record<string, unknown> = {}) {
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
    const markCancelled = jest.fn().mockResolvedValue(
      createJob({
        status: EAppointmentReminderJobStatus.CANCELLED,
      }),
    );
    const createNotification = jest.fn();
    const sendWebPush = jest.fn();

    const useCase = new ProcessDueAppointmentRemindersJobUseCase(
      {
        claimDueBatch,
        markCancelled,
      } as unknown as IAppointmentReminderJobRepository,
      {
        findEntityById: jest
          .fn()
          .mockResolvedValue(
            createConfirmedAppointment({ status: EAppointmentStatus.PENDING }),
          ),
      } as unknown as IAppointmentRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as unknown as IMasterProfileRepository,
      { findEntityById: jest.fn() } as never,
      { execute: createNotification } as never,
      { execute: sendWebPush } as never,
      {
        resolve: jest.fn().mockReturnValue({
          title: 'Appointment reminder',
          body: 'Reminder body',
        }),
      } as never,
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
    const markSent = jest
      .fn()
      .mockResolvedValue(
        createJob({ status: EAppointmentReminderJobStatus.SENT }),
      );
    const createNotification = jest.fn().mockResolvedValue({ id: 'n-1' });
    const sendWebPush = jest.fn().mockResolvedValue({
      attempted: 0,
      succeeded: 0,
      failed: 0,
      expired: 0,
    });

    const useCase = new ProcessDueAppointmentRemindersJobUseCase(
      {
        claimDueBatch,
        markSent,
      } as unknown as IAppointmentReminderJobRepository,
      {
        findEntityById: jest
          .fn()
          .mockResolvedValue(createConfirmedAppointment()),
      } as unknown as IAppointmentRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as unknown as IMasterProfileRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({ language: 'RU' }),
      } as never,
      { execute: createNotification } as never,
      { execute: sendWebPush } as never,
      {
        resolve: jest.fn().mockReturnValue({
          title: 'Напоминание о записи',
          body: 'Запись «Haircut» через 2 часа',
        }),
      } as never,
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
