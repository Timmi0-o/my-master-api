import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat-message/appointment-chat-message-select-fields';
import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

const PRESETS: Record<TPresetType, SelectOptions<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations>> = {
  MINIMAL: { select: ['id', 'chatId', 'senderUserId'] },
  SHORT: { select: ['id', 'chatId', 'senderUserId', 'body', 'createdAt', 'updatedAt'] },
  BASE: {
    select: [...APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS],
    include: {
      chat: {
        select: ['id', 'appointmentId', 'createdAt', 'updatedAt', 'deletedAt'] as (keyof IAppointmentChatPublicEntity)[],
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
): SelectOptions<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations> {
  const config = PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(config.select, isStaffUser);
  return { select: select as typeof config.select, include: config.include };
}
