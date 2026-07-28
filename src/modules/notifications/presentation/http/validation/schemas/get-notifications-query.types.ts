import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { INotificationFiltersPreset } from '../types/notification-filters-preset.types';

export const NOTIFICATION_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'category',
  'type',
  'readAt',
  'archivedAt',
  'createdAt',
  'updatedAt',
] as const;

export type TNotificationListOrderField =
  (typeof NOTIFICATION_LIST_ORDER_FIELDS)[number];

export interface IGetNotificationsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TNotificationListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: INotificationFiltersPreset;
  requiredIds?: string[];
}
