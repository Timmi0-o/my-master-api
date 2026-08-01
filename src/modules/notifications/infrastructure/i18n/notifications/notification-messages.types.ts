import type { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';

export type NotificationMessages = {
  APPOINTMENT_CREATED: { title: string; body: string };
  APPOINTMENT_CONFIRMED: { title: string; body: string };
  APPOINTMENT_CANCELLED: { title: string; body: string };
  APPOINTMENT_COMPLETED: { title: string; body: string };
  APPOINTMENT_NO_SHOW: { title: string; body: string };
  APPOINTMENT_RESCHEDULED: { title: string; body: string };
  APPOINTMENT_REMINDER: { title: string; body: string };
  CHAT_MESSAGE: { title: string };
  reminderLabels: Record<EAppointmentReminderJobType, string>;
};
