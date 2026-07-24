import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { APPOINTMENT_CHAT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

/** Marker only — hydrate always loads avatar.file; keep depth ≤ 3 under appointment. */
const AVATAR_INCLUDE = {
  avatar: true as const,
} as const;

const CLIENT_USER_PROFILE_AVATAR_INCLUDE = {
  userProfile: {
    select: ['id', 'userId', 'displayName'] as const,
  },
} as const;

const PRESETS: Record<
  TPresetType,
  SelectOptions<IAppointmentChatPublicEntity, IAppointmentChatRelations>
> = {
  MINIMAL: { select: ['id', 'appointmentId'] },
  SHORT: { select: ['id', 'appointmentId', 'createdAt', 'updatedAt'] },
  BASE: {
    select: [...APPOINTMENT_CHAT_SELECT_FIELDS],
    include: {
      appointment: {
        include: {
          masterProfile: {
            select: ['id', 'userId', 'displayName', 'description', 'rating'],
            include: AVATAR_INCLUDE,
          },
          clientUser: {
            select: ['id', 'name', 'surname', 'patronymic'],
            include: CLIENT_USER_PROFILE_AVATAR_INCLUDE,
          },
        },
      },
      messages: {
        select: [
          'id',
          'chatId',
          'senderUserId',
          'body',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IAppointmentChatMessagePublicEntity)[],
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IAppointmentChatPublicEntity, IAppointmentChatRelations> {
  const config = PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );
  return { select: select as typeof config.select, include: config.include };
}
