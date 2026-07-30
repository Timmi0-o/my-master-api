import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import { NOTIFICATION_SELECT_FIELDS, NOTIFICATION_STAFF_ONLY_FIELDS } from 'src/modules/notifications/domain/entities/notification/notification-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';

type NotificationSelectOptions = PresetReadOptions<
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
): PresetReadOptions<INotificationPublicEntity, INotificationRelations> {
  const config = NOTIFICATION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    NOTIFICATION_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as NotificationSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { NOTIFICATION_SELECT_FIELDS };
