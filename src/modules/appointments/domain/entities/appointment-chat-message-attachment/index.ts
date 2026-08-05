export type {
  IAppointmentChatMessageAttachmentEntity,
  IAppointmentChatMessageAttachmentPublicEntity,
} from './i-appointment-chat-message-attachment.entity';
export type { IAppointmentChatMessageAttachmentRelations } from './i-appointment-chat-message-attachment-relations';
export type { ICreateAppointmentChatMessageAttachmentInput } from './i-create-appointment-chat-message-attachment.input';
export { EAppointmentChatMessageAttachmentKind } from './appointment-chat-message-attachment.enum';
export {
  APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_SELECT_FIELDS,
  APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_STAFF_ONLY_FIELDS,
  APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_FILE_SELECT_FIELDS,
} from './appointment-chat-message-attachment-select-fields';
export { AppointmentChatMessageAttachmentInvalidError } from './errors';
export {
  APPOINTMENT_CHAT_ATTACHMENT_OWNER_KIND,
  APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE,
  APPOINTMENT_CHAT_ATTACHMENT_MAX_BYTES,
  APPOINTMENT_CHAT_VOICE_MAX_DURATION_MS,
  APPOINTMENT_CHAT_ATTACHMENT_ALLOWED_MIME_TYPES,
  APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS,
  APPOINTMENT_CHAT_ATTACHMENT_KIND_TO_FILE_TYPE,
  ensureAttachmentCountWithinLimit,
  ensureAttachmentFileSizeAllowed,
  ensureAttachmentMimeAllowed,
  ensureVoiceDurationAllowed,
  ensureVoiceMessageShape,
  ensureMessageHasBodyOrAttachments,
  ensureFilesReadyForChatAttach,
  resolveAttachmentKindFromMime,
  isMimeAllowedForAttachmentKind,
} from './policies';
