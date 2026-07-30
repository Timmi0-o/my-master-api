import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { MASTER_SUBSCRIPTION_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-subscription/master-subscription-select-fields';
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
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_SUBSCRIPTION_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterSubscriptionPublicEntity,
    IMasterSubscriptionRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'userId', value: sanitized.userId },
    {
      type: 'stringArray',
      field: 'masterProfileId',
      value: sanitized.masterProfileId,
    },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
