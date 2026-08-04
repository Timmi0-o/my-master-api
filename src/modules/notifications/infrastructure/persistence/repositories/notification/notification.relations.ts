import { NOTIFICATION_SELECT_FIELDS } from 'src/modules/notifications/domain/entities/notification/notification-select-fields';
import {
  IMAGE_FILE_SELECT_FIELDS,
  IMAGE_SELECT_FIELDS,
} from 'src/modules/masters/domain/entities/image';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';

const NOTIFICATION_ACTOR_SELECT_FIELDS = [
  'id',
  'username',
  'name',
  'surname',
  'patronymic',
] as const;

const ACTOR_USER_PROFILE_NESTED: RelationConfig = {
  allowedSelectFields: [...USER_PROFILE_SELECT_FIELDS],
  nested: {
    avatar: {
      virtual: true,
      allowedSelectFields: [...IMAGE_SELECT_FIELDS],
      nested: {
        file: {
          allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
        },
      },
    },
  },
};

export const NOTIFICATION_RELATIONS: Record<string, RelationConfig> = {
  actor: {
    allowedSelectFields: [...NOTIFICATION_ACTOR_SELECT_FIELDS],
    nested: {
      userProfile: ACTOR_USER_PROFILE_NESTED,
    },
  },
};

export const NOTIFICATION_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: NOTIFICATION_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: NOTIFICATION_RELATIONS,
};
