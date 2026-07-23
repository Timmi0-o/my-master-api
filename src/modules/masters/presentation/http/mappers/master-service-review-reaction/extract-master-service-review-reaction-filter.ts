import type {
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
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
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterServiceReviewReactionPublicEntity,
    IMasterServiceReviewReactionRelations
  >[] = [];

  const pushString = (
    field: keyof IMasterServiceReviewReactionPublicEntity & string,
    value: IMasterServiceReviewReactionFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterServiceReviewReactionPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('masterServiceReviewId', sanitized.masterServiceReviewId);
  pushString('type', sanitized.type);

  const pushDate = (
    field: keyof IMasterServiceReviewReactionPublicEntity & string,
    value: IMasterServiceReviewReactionFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part =
      mapMultiDateRangeFilter<IMasterServiceReviewReactionPublicEntity>(
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
