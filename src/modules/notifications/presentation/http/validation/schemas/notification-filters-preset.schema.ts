import { JSONSchemaType } from 'ajv';
import {
  NotificationCategory,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';
import type { INotificationFiltersPreset } from '../types/notification-filters-preset.types';

const statusFilterValueSchema = {
  type: 'object' as const,
  properties: {
    value: { type: 'boolean' as const },
  },
  required: ['value'] as const,
  additionalProperties: false as const,
};

export const notificationFiltersPresetSchema: JSONSchemaType<INotificationFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      userId: { ...filterUuidArraySchema, nullable: true },
      actorUserId: { ...filterUuidArraySchema, nullable: true },
      category: {
        ...filterEnumArraySchema(Object.values(NotificationCategory)),
        nullable: true,
      },
      type: {
        ...filterEnumArraySchema(Object.values(NotificationType)),
        nullable: true,
      },
      isRead: { ...statusFilterValueSchema, nullable: true },
      isArchived: { ...statusFilterValueSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
