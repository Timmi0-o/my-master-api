import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapMultiNumberRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
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
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterServiceReviewPublicEntity,
    IMasterServiceReviewRelations
  >[] = [];

  const pushString = (
    field: keyof IMasterServiceReviewPublicEntity & string,
    value: IMasterServiceReviewFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterServiceReviewPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('masterServiceId', sanitized.masterServiceId);
  pushString('clientUserId', sanitized.clientUserId);
  pushString('appointmentId', sanitized.appointmentId);

  if (sanitized.rating) {
    const part = mapMultiNumberRangeFilter<IMasterServiceReviewPublicEntity>(
      'rating',
      sanitized.rating,
    );
    if (part) parts.push(part);
  }

  const pushDate = (
    field: keyof IMasterServiceReviewPublicEntity & string,
    value: IMasterServiceReviewFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterServiceReviewPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return { and: parts };
}
