import { MASTER_SERVICE_REVIEW_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-select-fields';
import { MASTER_SERVICE_REVIEW_REACTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-review-reaction/master-service-review-reaction-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SERVICE_REVIEW_REACTION_RELATIONS: Record<
  string,
  RelationConfig
> = {
  user: {
    allowedSelectFields: ['id', 'username', 'name', 'surname', 'patronymic'],
  },
  masterServiceReview: {
    allowedSelectFields: [...MASTER_SERVICE_REVIEW_SELECT_FIELDS],
  },
};

export const MASTER_SERVICE_REVIEW_REACTION_VALIDATION_CONFIG: ReadOptionsValidationConfig =
  {
    allowedSelectFields: MASTER_SERVICE_REVIEW_REACTION_SELECT_FIELDS,
    maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
    includeGraph: MASTER_SERVICE_REVIEW_REACTION_RELATIONS,
  };
