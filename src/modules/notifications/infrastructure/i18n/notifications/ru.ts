import { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { NotificationMessages } from './notification-messages.types';

export const notificationMessagesRu: NotificationMessages = {
  APPOINTMENT_CREATED: {
    title: 'У вас новая запись',
    body: 'Новая запись от {{date}}',
  },
  APPOINTMENT_CONFIRMED: {
    title: 'Запись подтверждена',
    body: 'Мастер подтвердил запись «{{serviceName}}»',
  },
  APPOINTMENT_CANCELLED: {
    title: 'Запись отменена',
    body: 'Запись «{{serviceName}}» отменена',
  },
  APPOINTMENT_COMPLETED: {
    title: 'Запись завершена',
    body: 'Запись «{{serviceName}}» завершена',
  },
  APPOINTMENT_NO_SHOW: {
    title: 'Клиент не пришёл',
    body: 'Запись «{{serviceName}}» отмечена как неявка',
  },
  APPOINTMENT_RESCHEDULED: {
    title: 'Запись перенесена',
    body: 'Запись «{{serviceName}}» перенесена на другое время',
  },
  APPOINTMENT_REMINDER: {
    title: 'Напоминание о записи',
    body: 'Запись «{{serviceName}}» {{reminderLabel}}',
  },
  CHAT_MESSAGE: {
    title: 'Новое сообщение',
  },
  reminderLabels: {
    [EAppointmentReminderJobType.REMINDER_48H]: 'через 48 часов',
    [EAppointmentReminderJobType.REMINDER_24H]: 'через 24 часа',
    [EAppointmentReminderJobType.REMINDER_12H]: 'через 12 часов',
    [EAppointmentReminderJobType.REMINDER_6H]: 'через 6 часов',
    [EAppointmentReminderJobType.REMINDER_4H]: 'через 4 часа',
    [EAppointmentReminderJobType.REMINDER_2H]: 'через 2 часа',
    [EAppointmentReminderJobType.REMINDER_30M]: 'через 30 минут',
  },
};
