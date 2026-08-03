import {
  AppointmentNotReschedulableError,
  EAppointmentStatus,
  ensureAppointmentReschedulable,
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

describe('ensureAppointmentReschedulable', () => {
  it('allows PENDING before startsAt', () => {
    const appointment = createAppointment({
      status: EAppointmentStatus.PENDING,
    });
    const now = new Date('2026-08-01T09:59:59.000Z');

    expect(() =>
      ensureAppointmentReschedulable(appointment as never, now),
    ).not.toThrow();
  });

  it('allows CONFIRMED before startsAt', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T09:59:59.000Z');

    expect(() =>
      ensureAppointmentReschedulable(appointment as never, now),
    ).not.toThrow();
  });

  it('rejects at startsAt', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T10:00:00.000Z');

    expect(() =>
      ensureAppointmentReschedulable(appointment as never, now),
    ).toThrow(AppointmentNotReschedulableError);

    try {
      ensureAppointmentReschedulable(appointment as never, now);
    } catch (error) {
      expect(error).toBeInstanceOf(AppointmentNotReschedulableError);
      expect((error as AppointmentNotReschedulableError).context).toEqual(
        expect.objectContaining({ reason: 'already_started' }),
      );
    }
  });

  it('rejects after startsAt', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T10:00:01.000Z');

    expect(() =>
      ensureAppointmentReschedulable(appointment as never, now),
    ).toThrow(AppointmentNotReschedulableError);
  });

  it('rejects non-reschedulable status', () => {
    const appointment = createAppointment({
      status: EAppointmentStatus.CANCELLED,
    });
    const now = new Date('2026-08-01T09:00:00.000Z');

    expect(() =>
      ensureAppointmentReschedulable(appointment as never, now),
    ).toThrow(AppointmentNotReschedulableError);

    try {
      ensureAppointmentReschedulable(appointment as never, now);
    } catch (error) {
      expect(error).toBeInstanceOf(AppointmentNotReschedulableError);
      expect((error as AppointmentNotReschedulableError).context).toEqual(
        expect.objectContaining({ reason: 'status' }),
      );
    }
  });
});
