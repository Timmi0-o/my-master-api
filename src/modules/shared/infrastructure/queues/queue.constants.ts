export const QUEUE_NAMES = {
  APPOINTMENT_REMINDERS: 'appointment-reminders',
  APPOINTMENT_AUTO_COMPLETE: 'appointment-auto-complete',
  APPOINTMENT_CHAT_UNREAD_REMINDERS: 'appointment-chat-unread-reminders',
  MASTER_ONBOARDING_DEMOTE: 'master-onboarding-demote',
  CALL_RING_TIMEOUT: 'call-ring-timeout',
  IMAGE_VARIANTS: 'image-variants',
} as const;

export type TQueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const QUEUE_JOB_NAMES = {
  PROCESS_DUE_REMINDERS: 'process-due-reminders',
  PROCESS_AUTO_COMPLETE: 'process-auto-complete',
  PROCESS_CHAT_UNREAD_REMINDERS: 'process-chat-unread-reminders',
  PROCESS_ONBOARDING_DEMOTE: 'process-onboarding-demote',
  CALL_RING_TIMEOUT: 'call-ring-timeout',
  PROCESS_IMAGE_VARIANTS: 'process-image-variants',
} as const;
