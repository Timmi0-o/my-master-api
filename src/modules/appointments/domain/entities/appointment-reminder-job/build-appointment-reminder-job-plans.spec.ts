import {
  EAppointmentReminderJobType,
  buildAppointmentReminderJobPlans,
} from 'src/modules/appointments/domain/entities/appointment-reminder-job';

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
