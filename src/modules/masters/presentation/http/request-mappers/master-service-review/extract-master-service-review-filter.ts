import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { MASTER_SERVICE_REVIEW_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-select-fields';
import type { IMasterServiceReviewFiltersPreset } from '../../validation/types/master-service-review-filters-preset.types';

export function extractMasterServiceReviewFilter(
  filter: IMasterServiceReviewFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IMasterServiceReviewPublicEntity,
      IMasterServiceReviewRelations
    >
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_SERVICE_REVIEW_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterServiceReviewPublicEntity,
    IMasterServiceReviewRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'masterServiceId',
      value: sanitized.masterServiceId,
    },
    {
      type: 'stringArray',
      field: 'clientUserId',
      value: sanitized.clientUserId,
    },
    {
      type: 'stringArray',
      field: 'appointmentId',
      value: sanitized.appointmentId,
    },
    { type: 'numberRange', field: 'rating', value: sanitized.rating },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
