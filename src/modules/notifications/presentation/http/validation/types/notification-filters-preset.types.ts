import type {
  IDateRangeArrayFilter,
  IStatusFilterValue,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
import type {
  NotificationCategory,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';

export interface INotificationFiltersPreset {
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  actorUserId?: IStringArrayFilter;
  category?: { value: NotificationCategory[]; mode?: 'OR' | 'AND' | null };
  type?: { value: NotificationType[]; mode?: 'OR' | 'AND' | null };
  isRead?: IStatusFilterValue;
  isArchived?: IStatusFilterValue;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}
