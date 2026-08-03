import {
  AppointmentForbiddenError,
  AppointmentNotNoShowableError,
  EAppointmentStatus,
  NO_SHOW_LATE_MINUTES,
  ensureActorCanMarkNoShow,
  ensureAppointmentNoShowable,
  isAppointmentNoShowEligible,
} from 'src/modules/appointments/domain/entities/appointment';

function createAppointment(
  overrides: Record<string, unknown> = {},
) {
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

describe('appointment NO_SHOW policies', () => {
  it(`is eligible only when CONFIRMED and ${NO_SHOW_LATE_MINUTES}+ minutes late`, () => {
    const appointment = createAppointment();
    const tooEarly = new Date('2026-08-01T10:14:59.000Z');
    const eligible = new Date('2026-08-01T10:15:00.000Z');

    expect(isAppointmentNoShowEligible(appointment, tooEarly)).toBe(false);
    expect(isAppointmentNoShowEligible(appointment, eligible)).toBe(true);
  });

  it('rejects PENDING status', () => {
    const appointment = createAppointment({
      status: EAppointmentStatus.PENDING,
    });
    const now = new Date('2026-08-01T11:00:00.000Z');

    expect(() => ensureAppointmentNoShowable(appointment as never, now)).toThrow(
      AppointmentNotNoShowableError,
    );
  });

  it('rejects too early NO_SHOW', () => {
    const appointment = createAppointment();
    const now = new Date('2026-08-01T10:10:00.000Z');

    expect(() => ensureAppointmentNoShowable(appointment as never, now)).toThrow(
      AppointmentNotNoShowableError,
    );
  });

  it('allows master owner to mark NO_SHOW', () => {
    expect(() =>
      ensureActorCanMarkNoShow('appt-1', { userId: 'master-1', isStaffUser: false }, 'master-1'),
    ).not.toThrow();
  });

  it('forbids client from marking NO_SHOW', () => {
    expect(() =>
      ensureActorCanMarkNoShow('appt-1', { userId: 'client-1', isStaffUser: false }, 'master-1'),
    ).toThrow(AppointmentForbiddenError);
  });
});
