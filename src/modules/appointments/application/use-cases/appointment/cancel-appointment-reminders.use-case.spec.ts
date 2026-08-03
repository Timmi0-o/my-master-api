import { CancelAppointmentRemindersUseCase } from 'src/modules/appointments/application/use-cases/appointment/cancel-appointment-reminders.use-case';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';

describe('CancelAppointmentRemindersUseCase', () => {
  it('cancels active reminder jobs for appointment', async () => {
    const cancelActiveByAppointmentId = jest.fn().mockResolvedValue(2);
    const cancelByAppointmentId = jest.fn().mockResolvedValue(undefined);

    const useCase = new CancelAppointmentRemindersUseCase(
      {
        cancelActiveByAppointmentId,
      } as unknown as IAppointmentReminderJobRepository,
      { cancelByAppointmentId } as never,
    );

    const count = await useCase.execute({ appointmentId: 'appt-1' });

    expect(count).toBe(2);
    expect(cancelActiveByAppointmentId).toHaveBeenCalledWith(
      'appt-1',
      undefined,
    );
    expect(cancelByAppointmentId).toHaveBeenCalledWith('appt-1');
  });
});
