-- Expand AppointmentReminderJobType with additional reminder offsets.
ALTER TYPE "AppointmentReminderJobType" ADD VALUE IF NOT EXISTS 'REMINDER_48H';
ALTER TYPE "AppointmentReminderJobType" ADD VALUE IF NOT EXISTS 'REMINDER_12H';
ALTER TYPE "AppointmentReminderJobType" ADD VALUE IF NOT EXISTS 'REMINDER_6H';
ALTER TYPE "AppointmentReminderJobType" ADD VALUE IF NOT EXISTS 'REMINDER_4H';
ALTER TYPE "AppointmentReminderJobType" ADD VALUE IF NOT EXISTS 'REMINDER_30M';
