import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import { NOTIFICATION_SELECT_FIELDS } from 'src/modules/notifications/domain/entities/notification/notification-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type NotificationSelectOptions = SelectOptions<
  INotificationPublicEntity,
  INotificationRelations
>;

const ACTOR_PUBLIC_SELECT = [
  'id',
  'username',
  'name',
  'surname',
  'patronymic',
] as const;

const NOTIFICATION_PRESETS: Record<TPresetType, NotificationSelectOptions> = {
  MINIMAL: {
    select: ['id', 'category', 'type', 'title', 'readAt'],
  },
  SHORT: {
    select: [
      'id',
      'category',
      'type',
      'title',
      'body',
      'actionUrl',
      'readAt',
      'archivedAt',
      'createdAt',
    ],
  },
  BASE: {
    select: [...NOTIFICATION_SELECT_FIELDS],
    include: {
      actor: {
        select: ACTOR_PUBLIC_SELECT,
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<INotificationPublicEntity, INotificationRelations> {
  const config = NOTIFICATION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as NotificationSelectOptions['select'],
    include: config.include,
  };
}

export { NOTIFICATION_SELECT_FIELDS };
