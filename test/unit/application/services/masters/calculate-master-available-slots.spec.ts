import {
  calculateMasterAvailableSlots,
  isMasterStartsAtAvailable,
} from 'src/modules/masters/application/services/calculate-master-available-slots';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IAppointmentEntity } from 'src/modules/appointments/domain/entities/appointment';
import type { IMasterProfileEntity } from 'src/modules/masters/domain/entities/master-profile';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';
import type { IMasterScheduleExceptionEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception.enum';
import type { IMasterServiceEntity } from 'src/modules/masters/domain/entities/master-service';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service/master-service-category.enum';
import type { IMasterWeeklyScheduleEntity } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule.enum';
import { fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Europe/Moscow';
/** Monday 2026-08-03 */
const DATE = '2026-08-03';
const NOW = fromZonedTime(new Date(2026, 7, 1, 12, 0, 0, 0), TIMEZONE);

function createProfile(
  overrides: Partial<IMasterProfileEntity> = {},
): IMasterProfileEntity {
  return {
    id: 'mp-1',
    userId: 'master-1',
    displayName: 'Master',
    description: '',
    rating: 0,
    timezone: TIMEZONE,
    bookingStatus: EMasterBookingStatus.ACCEPTING,
    pausedUntil: null,
    minNoticeMinutes: 0,
    maxBookingDaysAhead: 365,
    slotStepMinutes: 30,
    bufferBetweenAppointmentsMinutes: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createService(
  overrides: Partial<IMasterServiceEntity> = {},
): IMasterServiceEntity {
  return {
    id: 'svc-1',
    masterProfileId: 'mp-1',
    name: 'Haircut',
    description: '',
    price: 100,
    rating: 0,
    durationMinutes: 60,
    category: EMasterServiceCategory.BEAUTY,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createWeekly(
  dayOfWeek: EDayOfWeek,
  startTime: string,
  endTime: string,
): IMasterWeeklyScheduleEntity {
  return {
    id: 'ws-1',
    masterProfileId: 'mp-1',
    dayOfWeek,
    startTime,
    endTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function slotAt(hours: number, minutes = 0): Date {
  return fromZonedTime(
    new Date(2026, 7, 3, hours, minutes, 0, 0),
    TIMEZONE,
  );
}

describe('calculateMasterAvailableSlots / isMasterStartsAtAvailable', () => {
  const weeklySchedules = [
    createWeekly(EDayOfWeek.MONDAY, '09:00', '18:00'),
  ];

  it('returns startsAt when it is on the grid and free', () => {
    const startsAt = slotAt(10);

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments: [],
        startsAt,
        now: NOW,
      }),
    ).toBe(true);
  });

  it('blocks overlap with another service of the same master including buffer', () => {
    const appointments = [
      {
        id: 'appt-1',
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-other',
        clientUserId: 'client-2',
        chatId: 'chat-1',
        startsAt: slotAt(9, 30),
        durationMinutes: 60,
        status: EAppointmentStatus.CONFIRMED,
        totalPrice: 100,
        serviceName: 'Other',
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        isEarlyCompletionByMaster: false,
        isEarlyCompletionByClient: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as IAppointmentEntity[];

    // 10:00 overlaps buffer after 09:30–10:30 (+15m buffer → blocked until 10:45)
    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments,
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(false);

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments,
        startsAt: slotAt(11),
        now: NOW,
      }),
    ).toBe(true);
  });

  it('ignores CANCELLED appointments when checking availability', () => {
    const appointments = [
      {
        id: 'appt-cancelled',
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        clientUserId: 'client-2',
        chatId: 'chat-1',
        startsAt: slotAt(10),
        durationMinutes: 60,
        status: EAppointmentStatus.CANCELLED,
        totalPrice: 100,
        serviceName: 'Haircut',
        cancelledAt: new Date(),
        cancelledBy: null,
        cancelReason: null,
        isEarlyCompletionByMaster: false,
        isEarlyCompletionByClient: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as IAppointmentEntity[];

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments,
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(true);
  });

  it('returns no slots when booking is CLOSED', () => {
    const slots = calculateMasterAvailableSlots({
      profile: createProfile({ bookingStatus: EMasterBookingStatus.CLOSED }),
      service: createService(),
      date: DATE,
      weeklySchedules,
      exceptions: [],
      appointments: [],
      now: NOW,
    });

    expect(slots).toEqual([]);
    expect(
      isMasterStartsAtAvailable({
        profile: createProfile({ bookingStatus: EMasterBookingStatus.CLOSED }),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments: [],
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(false);
  });

  it('returns false when startsAt is outside work window', () => {
    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules: [createWeekly(EDayOfWeek.MONDAY, '12:00', '18:00')],
        exceptions: [],
        appointments: [],
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(false);
  });

  it('blocks CLOSED schedule exceptions', () => {
    const exceptions = [
      {
        id: 'ex-1',
        masterProfileId: 'mp-1',
        kind: EMasterScheduleExceptionKind.CLOSED,
        startsAt: slotAt(9),
        endsAt: slotAt(12),
        customStartTime: null,
        customEndTime: null,
        title: null,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as IMasterScheduleExceptionEntity[];

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions,
        appointments: [],
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(false);
  });

  it('blocks slots that overlap the client own appointment by startsAt+duration', () => {
    const clientAppointments = [
      {
        id: 'appt-client',
        masterProfileId: 'mp-other',
        masterServiceId: 'svc-other',
        clientUserId: 'client-1',
        chatId: 'chat-1',
        startsAt: slotAt(9, 30),
        durationMinutes: 60,
        status: EAppointmentStatus.PENDING,
        totalPrice: 100,
        serviceName: 'Other',
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        isEarlyCompletionByMaster: false,
        isEarlyCompletionByClient: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as IAppointmentEntity[];

    // 10:00–11:00 overlaps client 09:30–10:30 (no master buffer applied)
    expect(
      isMasterStartsAtAvailable({
        profile: createProfile({ bufferBetweenAppointmentsMinutes: 0 }),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments: [],
        clientAppointments,
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(false);

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile({ bufferBetweenAppointmentsMinutes: 0 }),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments: [],
        clientAppointments,
        startsAt: slotAt(10, 30),
        now: NOW,
      }),
    ).toBe(true);
  });

  it('does not block client slots for COMPLETED or CANCELLED appointments', () => {
    const clientAppointments = [
      {
        id: 'appt-done',
        masterProfileId: 'mp-other',
        masterServiceId: 'svc-other',
        clientUserId: 'client-1',
        chatId: 'chat-1',
        startsAt: slotAt(10),
        durationMinutes: 60,
        status: EAppointmentStatus.COMPLETED,
        totalPrice: 100,
        serviceName: 'Other',
        cancelledAt: null,
        cancelledBy: null,
        cancelReason: null,
        isEarlyCompletionByMaster: false,
        isEarlyCompletionByClient: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as IAppointmentEntity[];

    expect(
      isMasterStartsAtAvailable({
        profile: createProfile(),
        service: createService(),
        date: DATE,
        weeklySchedules,
        exceptions: [],
        appointments: [],
        clientAppointments,
        startsAt: slotAt(10),
        now: NOW,
      }),
    ).toBe(true);
  });
});
