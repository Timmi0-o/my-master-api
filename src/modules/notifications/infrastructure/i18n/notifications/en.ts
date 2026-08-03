import { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { NotificationMessages } from './notification-messages.types';

export const notificationMessagesEn: NotificationMessages = {
  APPOINTMENT_CREATED: {
    title: 'You have a new appointment',
    body: 'New appointment from {{date}}',
  },
  APPOINTMENT_CONFIRMED: {
    title: 'Appointment confirmed',
    body: 'The master confirmed «{{serviceName}}»',
  },
  APPOINTMENT_CANCELLED: {
    title: 'Appointment cancelled',
    body: 'Appointment «{{serviceName}}» was cancelled',
  },
  APPOINTMENT_COMPLETED: {
    title: 'Appointment completed',
    body: 'Appointment «{{serviceName}}» is completed',
  },
  APPOINTMENT_NO_SHOW: {
    title: 'Client no-show',
    body: 'Appointment «{{serviceName}}» was marked as no-show',
  },
  APPOINTMENT_RESCHEDULED: {
    title: 'Appointment rescheduled',
    body: 'Appointment «{{serviceName}}» was moved to a new time',
  },
  APPOINTMENT_REMINDER: {
    title: 'Appointment reminder',
    body: 'Appointment «{{serviceName}}» {{reminderLabel}}',
  },
  CHAT_MESSAGE: {
    title: 'New message',
  },
  CHAT_UNREAD_REMINDER: {
    title: 'Unread message',
    body: '{{senderName}} is waiting for your reply',
  },
  reminderLabels: {
    [EAppointmentReminderJobType.REMINDER_48H]: 'in 48 hours',
    [EAppointmentReminderJobType.REMINDER_24H]: 'in 24 hours',
    [EAppointmentReminderJobType.REMINDER_12H]: 'in 12 hours',
    [EAppointmentReminderJobType.REMINDER_6H]: 'in 6 hours',
    [EAppointmentReminderJobType.REMINDER_4H]: 'in 4 hours',
    [EAppointmentReminderJobType.REMINDER_2H]: 'in 2 hours',
    [EAppointmentReminderJobType.REMINDER_30M]: 'in 30 minutes',
  },
};
