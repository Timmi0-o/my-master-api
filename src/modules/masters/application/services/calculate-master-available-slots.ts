import type { IAppointmentEntity } from 'src/modules/appointments/domain/entities/appointment';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IMasterProfileEntity } from 'src/modules/masters/domain/entities/master-profile';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';
import type { IMasterScheduleExceptionEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception.enum';
import type { IMasterServiceEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterWeeklyScheduleEntity } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule.enum';
import {
  addDays,
  addMinutes,
  getDay,
  isAfter,
  isBefore,
  max as maxDate,
  min as minDate,
} from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

export interface IAvailableSlot {
  startsAt: string;
}

export interface ICalculateMasterAvailableSlotsInput {
  profile: IMasterProfileEntity;
  service: IMasterServiceEntity;
  date: string;
  weeklySchedules: IMasterWeeklyScheduleEntity[];
  exceptions: IMasterScheduleExceptionEntity[];
  appointments: IAppointmentEntity[];
  now?: Date;
}

const JS_DAY_TO_ENUM: EDayOfWeek[] = [
  EDayOfWeek.SUNDAY,
  EDayOfWeek.MONDAY,
  EDayOfWeek.TUESDAY,
  EDayOfWeek.WEDNESDAY,
  EDayOfWeek.THURSDAY,
  EDayOfWeek.FRIDAY,
  EDayOfWeek.SATURDAY,
];

interface ITimeWindow {
  start: Date;
  end: Date;
}

function parseLocalDateTime(
  localDate: string,
  time: string,
  timezone: string,
): Date {
  const [year, month, day] = localDate.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return fromZonedTime(
    new Date(year, month - 1, day, hours, minutes, 0, 0),
    timezone,
  );
}

export function getLocalDayBoundsUtc(
  localDate: string,
  timezone: string,
): { dayStart: Date; dayEnd: Date } {
  const dayStart = parseLocalDateTime(localDate, '00:00', timezone);
  const nextDay = formatInTimeZone(
    addDays(dayStart, 1),
    timezone,
    'yyyy-MM-dd',
  );
  const dayEnd = parseLocalDateTime(nextDay, '00:00', timezone);
  return { dayStart, dayEnd };
}

function isBookingOpen(profile: IMasterProfileEntity, now: Date): boolean {
  if (profile.bookingStatus === EMasterBookingStatus.CLOSED) {
    return false;
  }
  if (profile.bookingStatus === EMasterBookingStatus.PAUSED) {
    if (profile.pausedUntil && isAfter(profile.pausedUntil, now)) {
      return false;
    }
  }
  return true;
}

function buildWorkWindows(
  localDate: string,
  timezone: string,
  dayOfWeek: EDayOfWeek,
  weeklySchedules: IMasterWeeklyScheduleEntity[],
  exceptions: IMasterScheduleExceptionEntity[],
): ITimeWindow[] {
  const { dayStart, dayEnd } = getLocalDayBoundsUtc(localDate, timezone);

  const customHoursException = exceptions.find((ex) => {
    if (ex.kind !== EMasterScheduleExceptionKind.CUSTOM_HOURS) {
      return false;
    }
    if (!ex.customStartTime || !ex.customEndTime) {
      return false;
    }
    const localStartDate = formatInTimeZone(ex.startsAt, timezone, 'yyyy-MM-dd');
    const localEndDate = formatInTimeZone(ex.endsAt, timezone, 'yyyy-MM-dd');
    return localStartDate <= localDate && localEndDate >= localDate;
  });

  if (customHoursException?.customStartTime && customHoursException.customEndTime) {
    const start = parseLocalDateTime(
      localDate,
      customHoursException.customStartTime,
      timezone,
    );
    const end = parseLocalDateTime(
      localDate,
      customHoursException.customEndTime,
      timezone,
    );
    if (isBefore(start, end)) {
      return [{ start: maxDate([start, dayStart]), end: minDate([end, dayEnd]) }];
    }
    return [];
  }

  const daySchedules = weeklySchedules.filter((s) => s.dayOfWeek === dayOfWeek);
  const windows: ITimeWindow[] = daySchedules
    .map((schedule) => ({
      start: parseLocalDateTime(localDate, schedule.startTime, timezone),
      end: parseLocalDateTime(localDate, schedule.endTime, timezone),
    }))
    .filter((w) => isBefore(w.start, w.end))
    .map((w) => ({
      start: maxDate([w.start, dayStart]),
      end: minDate([w.end, dayEnd]),
    }))
    .filter((w) => isBefore(w.start, w.end));

  return windows;
}

function overlapsInterval(
  slotStart: Date,
  slotEnd: Date,
  intervalStart: Date,
  intervalEnd: Date,
): boolean {
  return isBefore(slotStart, intervalEnd) && isAfter(slotEnd, intervalStart);
}

function isSlotBlocked(
  slotStart: Date,
  slotEnd: Date,
  bufferMinutes: number,
  exceptions: IMasterScheduleExceptionEntity[],
  appointments: IAppointmentEntity[],
): boolean {
  for (const ex of exceptions) {
    if (ex.kind !== EMasterScheduleExceptionKind.CLOSED) {
      continue;
    }
    if (overlapsInterval(slotStart, slotEnd, ex.startsAt, ex.endsAt)) {
      return true;
    }
  }

  for (const appt of appointments) {
    if (appt.status === EAppointmentStatus.CANCELLED) {
      continue;
    }
    const apptEnd = addMinutes(appt.startsAt, appt.durationMinutes);
    const blockedStart = addMinutes(appt.startsAt, -bufferMinutes);
    const blockedEnd = addMinutes(apptEnd, bufferMinutes);
    if (overlapsInterval(slotStart, slotEnd, blockedStart, blockedEnd)) {
      return true;
    }
  }

  return false;
}

export function calculateMasterAvailableSlots(
  input: ICalculateMasterAvailableSlotsInput,
): IAvailableSlot[] {
  const now = input.now ?? new Date();
  const { profile, service, date, weeklySchedules, exceptions, appointments } =
    input;

  if (!isBookingOpen(profile, now)) {
    return [];
  }

  const timezone = profile.timezone || 'Europe/Moscow';
  const { dayStart, dayEnd } = getLocalDayBoundsUtc(date, timezone);

  const localMaxDate = formatInTimeZone(
    addDays(now, profile.maxBookingDaysAhead),
    timezone,
    'yyyy-MM-dd',
  );
  if (date > localMaxDate) {
    return [];
  }
  if (isBefore(dayEnd, now)) {
    return [];
  }

  const localToday = formatInTimeZone(now, timezone, 'yyyy-MM-dd');
  if (date < localToday) {
    return [];
  }

  const dayOfWeek = JS_DAY_TO_ENUM[getDay(toZonedTime(dayStart, timezone))];
  const workWindows = buildWorkWindows(
    date,
    timezone,
    dayOfWeek,
    weeklySchedules,
    exceptions,
  );

  if (!workWindows.length) {
    return [];
  }

  const minNoticeAt = addMinutes(now, profile.minNoticeMinutes);
  const slotStep = profile.slotStepMinutes;
  const duration = service.durationMinutes;
  const buffer = profile.bufferBetweenAppointmentsMinutes;
  const slots: IAvailableSlot[] = [];

  for (const window of workWindows) {
    let cursor = window.start;

    while (isBefore(addMinutes(cursor, duration), window.end)) {
      const slotEnd = addMinutes(cursor, duration);

      if (
        !isBefore(cursor, minNoticeAt) &&
        !isSlotBlocked(cursor, slotEnd, buffer, exceptions, appointments)
      ) {
        slots.push({ startsAt: cursor.toISOString() });
      }

      cursor = addMinutes(cursor, slotStep);
    }
  }

  return slots;
}
