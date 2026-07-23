import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IMasterSubscriptionFiltersPreset } from '../../validation/types/master-subscription-filters-preset.types';

export function extractMasterSubscriptionFilter(
  filter: IMasterSubscriptionFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IMasterSubscriptionPublicEntity,
      IMasterSubscriptionRelations
    >
  | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterSubscriptionPublicEntity,
    IMasterSubscriptionRelations
  >[] = [];

  const pushString = (
    field: keyof IMasterSubscriptionPublicEntity & string,
    value: IMasterSubscriptionFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterSubscriptionPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('masterProfileId', sanitized.masterProfileId);

  const pushDate = (
    field: keyof IMasterSubscriptionPublicEntity & string,
    value: IMasterSubscriptionFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterSubscriptionPublicEntity>(
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
