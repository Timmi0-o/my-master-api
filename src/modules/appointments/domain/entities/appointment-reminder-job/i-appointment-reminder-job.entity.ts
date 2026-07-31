export enum EAppointmentReminderJobType {
  REMINDER_48H = 'REMINDER_48H',
  REMINDER_24H = 'REMINDER_24H',
  REMINDER_12H = 'REMINDER_12H',
  REMINDER_6H = 'REMINDER_6H',
  REMINDER_4H = 'REMINDER_4H',
  REMINDER_2H = 'REMINDER_2H',
  REMINDER_30M = 'REMINDER_30M',
}

export enum EAppointmentReminderJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export interface IAppointmentReminderJobEntity {
  id: string;
  appointmentId: string;
  type: EAppointmentReminderJobType;
  runAt: Date;
  status: EAppointmentReminderJobStatus;
  attempts: number;
  lastError: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateAppointmentReminderJobInput = {
  appointmentId: string;
  type: EAppointmentReminderJobType;
  runAt: Date;
};
