import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileType,
} from 'src/modules/files/domain/entities/file';
import { EAppointmentChatMessageAttachmentKind } from '../appointment-chat-message-attachment.enum';

export const APPOINTMENT_CHAT_ATTACHMENT_OWNER_KIND = 'appointment-chat';

export const APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE = 10;

export const APPOINTMENT_CHAT_ATTACHMENT_MAX_BYTES = {
  [EAppointmentChatMessageAttachmentKind.IMAGE]: 10 * 1024 * 1024,
  [EAppointmentChatMessageAttachmentKind.VIDEO]: 50 * 1024 * 1024,
  [EAppointmentChatMessageAttachmentKind.DOCUMENT]: 50 * 1024 * 1024,
  [EAppointmentChatMessageAttachmentKind.VOICE]: 20 * 1024 * 1024,
} as const;

/** Max voice duration (Telegram-inspired web default). */
export const APPOINTMENT_CHAT_VOICE_MAX_DURATION_MS = 15 * 60 * 1000;

export const APPOINTMENT_CHAT_ATTACHMENT_ALLOWED_MIME_TYPES: Record<
  EAppointmentChatMessageAttachmentKind,
  readonly string[]
> = {
  [EAppointmentChatMessageAttachmentKind.IMAGE]: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    // iPhone Camera Roll (HEIF)
    'image/heic',
    'image/heif',
  ],
  [EAppointmentChatMessageAttachmentKind.VIDEO]: [
    'video/mp4',
    'video/webm',
    // iPhone Camera / Files (.mov, .m4v, 3GP)
    'video/quicktime',
    'video/x-m4v',
    'video/3gpp',
    'video/3gpp2',
    'video/mpeg',
  ],
  [EAppointmentChatMessageAttachmentKind.DOCUMENT]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
  ],
  [EAppointmentChatMessageAttachmentKind.VOICE]: [
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/ogg',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/aac',
    'audio/mpeg',
  ],
};

export const APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS = {
  ownerKind: APPOINTMENT_CHAT_ATTACHMENT_OWNER_KIND,
  ownerType: FileOwnerType.USER,
  accessLevel: FileAccessLevel.RESTRICTED,
  purpose: FilePurpose.APPOINTMENT_ATTACHMENT,
} as const;

export const APPOINTMENT_CHAT_ATTACHMENT_KIND_TO_FILE_TYPE: Record<
  EAppointmentChatMessageAttachmentKind,
  FileType
> = {
  [EAppointmentChatMessageAttachmentKind.IMAGE]: FileType.IMAGE,
  [EAppointmentChatMessageAttachmentKind.VIDEO]: FileType.VIDEO,
  [EAppointmentChatMessageAttachmentKind.DOCUMENT]: FileType.DOCUMENT,
  [EAppointmentChatMessageAttachmentKind.VOICE]: FileType.AUDIO,
};
