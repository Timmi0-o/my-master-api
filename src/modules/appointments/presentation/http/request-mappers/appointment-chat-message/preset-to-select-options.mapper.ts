import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';
import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS,
  APPOINTMENT_CHAT_MESSAGE_STAFF_ONLY_FIELDS,
} from 'src/modules/appointments/domain/entities/appointment-chat-message/appointment-chat-message-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';

const PRESETS: Record<
  TPresetType,
  PresetReadOptions<
    IAppointmentChatMessagePublicEntity,
    IAppointmentChatMessageRelations
  >
> = {
  MINIMAL: { select: ['id', 'chatId', 'senderUserId', 'actor'] },
  SHORT: {
    select: [
      'id',
      'chatId',
      'senderUserId',
      'actor',
      'body',
      'systemAction',
      'payload',
      'replyToMessageId',
      'editedAt',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [...APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS],
    include: {
      attachments: {
        select: [
          'id',
          'messageId',
          'fileId',
          'kind',
          'sortOrder',
          'durationMs',
          'createdAt',
          'updatedAt',
        ],
        include: {
          file: {
            select: [
              'id',
              'fileUrl',
              'originalName',
              'mimeType',
              'fileType',
              'purpose',
              'accessLevel',
              'status',
              'fileSize',
              'metadata',
              'createdAt',
              'updatedAt',
            ],
          },
        },
      },
      chat: {
        select: [
          'id',
          'masterProfileId',
          'clientUserId',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IAppointmentChatPublicEntity)[],
      },
      sender: {
        select: [
          'id',
          'email',
          'phone',
          'username',
          'roleId',
          'status',
          'language',
          'name',
          'surname',
          'patronymic',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IUserPublicEntity)[],
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations
> {
  const config = PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    APPOINTMENT_CHAT_MESSAGE_STAFF_ONLY_FIELDS,
  );
  return {
    select: select as typeof config.select,
    include: config.include,
    enrich: config.enrich,
  };
}
