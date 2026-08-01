import {
  AppointmentNotCompletableError,
  EAppointmentStatus,
  ensureAppointmentCompletable,
} from 'src/modules/appointments/domain/entities/appointment';

function createAppointment(overrides: Record<string, unknown> = {}) {
  return {
    id: 'appt-1',
    masterProfileId: 'mp-1',
    masterServiceId: 'svc-1',
    clientUserId: 'client-1',
    chatId: 'chat-1',
    startsAt: new Date('2026-08-01T10:00:00.000Z'),
    durationMinutes: 60,
    status: EAppointmentStatus.CONFIRMED,
    totalPrice: 100,
    serviceName: 'Haircut',
    cancelledAt: null,
    cancelledBy: null,
    cancelReason: null,
    isEarlyCompletionByMaster: false,
    isEarlyCompletionByClient: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

describe('ensureAppointmentCompletable', () => {
  it('rejects completion before startsAt', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T09:59:59.000Z');

    expect(() =>
      ensureAppointmentCompletable(appointment as never, now),
    ).toThrow(AppointmentNotCompletableError);

    try {
      ensureAppointmentCompletable(appointment as never, now);
    } catch (error) {
      expect(error).toBeInstanceOf(AppointmentNotCompletableError);
      expect((error as AppointmentNotCompletableError).context).toEqual(
        expect.objectContaining({ reason: 'not_started' }),
      );
    }
  });

  it('allows completion at startsAt', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T10:00:00.000Z');

    expect(() =>
      ensureAppointmentCompletable(appointment as never, now),
    ).not.toThrow();
  });

  it('allows early completion after start but before end', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T10:30:00.000Z');

    expect(() =>
      ensureAppointmentCompletable(appointment as never, now),
    ).not.toThrow();
  });

  it('rejects non-completable status', () => {
    const appointment = createAppointment({
      status: EAppointmentStatus.CANCELLED,
    });
    const now = new Date('2026-08-01T11:00:00.000Z');

    expect(() =>
      ensureAppointmentCompletable(appointment as never, now),
    ).toThrow(AppointmentNotCompletableError);
  });
});
