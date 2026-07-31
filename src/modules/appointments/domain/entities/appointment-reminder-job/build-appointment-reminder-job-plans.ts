import { EAppointmentReminderJobType } from './i-appointment-reminder-job.entity';

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

const REMINDER_OFFSETS_MS: ReadonlyArray<{
  type: EAppointmentReminderJobType;
  offsetMs: number;
}> = [
  {
    type: EAppointmentReminderJobType.REMINDER_48H,
    offsetMs: 48 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_24H,
    offsetMs: 24 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_12H,
    offsetMs: 12 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_6H,
    offsetMs: 6 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_4H,
    offsetMs: 4 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_2H,
    offsetMs: 2 * MS_PER_HOUR,
  },
  {
    type: EAppointmentReminderJobType.REMINDER_30M,
    offsetMs: 30 * MS_PER_MINUTE,
  },
];

export type IAppointmentReminderJobPlan = {
  type: EAppointmentReminderJobType;
  runAt: Date;
};

/** Builds future reminder jobs for a confirmed appointment. */
export function buildAppointmentReminderJobPlans(
  startsAt: Date,
  now: Date = new Date(),
): IAppointmentReminderJobPlan[] {
  const startsAtMs = startsAt.getTime();
  const nowMs = now.getTime();

  return REMINDER_OFFSETS_MS.map(({ type, offsetMs }) => ({
    type,
    runAt: new Date(startsAtMs - offsetMs),
  })).filter((plan) => plan.runAt.getTime() > nowMs);
}
