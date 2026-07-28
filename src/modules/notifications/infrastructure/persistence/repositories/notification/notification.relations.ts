import { NOTIFICATION_SELECT_FIELDS } from 'src/modules/notifications/domain/entities/notification/notification-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

const NOTIFICATION_ACTOR_SELECT_FIELDS = [
  'id',
  'username',
  'name',
  'surname',
  'patronymic',
] as const;

export const NOTIFICATION_RELATIONS: Record<string, RelationConfig> = {
  actor: {
    allowedSelectFields: [...NOTIFICATION_ACTOR_SELECT_FIELDS],
  },
};

export const NOTIFICATION_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: NOTIFICATION_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: NOTIFICATION_RELATIONS,
};
