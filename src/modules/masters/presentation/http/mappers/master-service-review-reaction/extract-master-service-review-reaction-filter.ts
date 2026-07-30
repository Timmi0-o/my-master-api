import type {
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { MASTER_SERVICE_REVIEW_REACTION_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-service-review-reaction/master-service-review-reaction-select-fields';
import type { IMasterServiceReviewReactionFiltersPreset } from '../../validation/types/master-service-review-reaction-filters-preset.types';

export function extractMasterServiceReviewReactionFilter(
  filter: IMasterServiceReviewReactionFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IMasterServiceReviewReactionPublicEntity,
      IMasterServiceReviewReactionRelations
    >
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_SERVICE_REVIEW_REACTION_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterServiceReviewReactionPublicEntity,
    IMasterServiceReviewReactionRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'userId', value: sanitized.userId },
    {
      type: 'stringArray',
      field: 'masterServiceReviewId',
      value: sanitized.masterServiceReviewId,
    },
    { type: 'stringArray', field: 'type', value: sanitized.type },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
