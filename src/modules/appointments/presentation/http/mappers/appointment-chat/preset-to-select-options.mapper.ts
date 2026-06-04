import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { APPOINTMENT_CHAT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

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
          },
          clientUser: {
            select: ['id', 'name', 'surname', 'patronymic'],
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
