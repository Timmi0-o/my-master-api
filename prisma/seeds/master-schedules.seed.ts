import type { DayOfWeek, PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';

/** Рабочие окна по дням недели (локальное время мастера, Europe/Moscow). */
const DEFAULT_WEEKLY_WINDOWS: ReadonlyArray<{
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}> = [
  { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '20:00' },
  { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '20:00' },
  { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '20:00' },
  { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '20:00' },
  { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '20:00' },
  { dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '18:00' },
  { dayOfWeek: 'SUNDAY', startTime: '10:00', endTime: '16:00' },
] as const;

const BOOKING_DEFAULTS = {
  timezone: 'Europe/Moscow',
  bookingStatus: 'ACCEPTING' as const,
  pausedUntil: null,
  minNoticeMinutes: 0,
  maxBookingDaysAhead: 60,
  slotStepMinutes: 30,
  bufferBetweenAppointmentsMinutes: 0,
};

export const masterSchedulesSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const profiles = await prisma.masterProfile.findMany({
    where: { deletedAt: null },
    select: { id: true, displayName: true },
    orderBy: { displayName: 'asc' },
  });

  if (profiles.length === 0) {
    throw new Error(
      'master-schedules seed: no master profiles. Run masters seed first.',
    );
  }

  const profileIds = profiles.map((p) => p.id);

  await prisma.masterScheduleException.deleteMany({
    where: { masterProfileId: { in: profileIds } },
  });

  let scheduleRows = 0;

  for (const profile of profiles) {
    await prisma.masterProfile.update({
      where: { id: profile.id },
      data: BOOKING_DEFAULTS,
    });

    for (const window of DEFAULT_WEEKLY_WINDOWS) {
      await prisma.masterWeeklySchedule.upsert({
        where: {
          masterProfileId_dayOfWeek_startTime: {
            masterProfileId: profile.id,
            dayOfWeek: window.dayOfWeek,
            startTime: window.startTime,
          },
        },
        create: {
          masterProfileId: profile.id,
          dayOfWeek: window.dayOfWeek,
          startTime: window.startTime,
          endTime: window.endTime,
        },
        update: {
          endTime: window.endTime,
          deletedAt: null,
        },
      });
      scheduleRows += 1;
    }
  }

  const weeklyCount = await prisma.masterWeeklySchedule.count({
    where: { deletedAt: null, masterProfileId: { in: profileIds } },
  });

  console.log(
    `master-schedules seed: ${profiles.length} profiles (booking ACCEPTING), ${scheduleRows} weekly windows upserted (${weeklyCount} active rows)`,
  );
};
