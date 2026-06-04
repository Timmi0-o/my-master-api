import type {
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IMasterScheduleExceptionFiltersPreset } from '../../validation/types/master-schedule-exception-filters-preset.types';

export function extractMasterScheduleExceptionFilter(
  filter: IMasterScheduleExceptionFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations
> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterScheduleExceptionPublicEntity,
    IMasterScheduleExceptionRelations
  >[] = [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IMasterScheduleExceptionPublicEntity>(
      sanitized.search.value,
      ['title', 'note'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IMasterScheduleExceptionPublicEntity & string,
    value: IMasterScheduleExceptionFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterScheduleExceptionPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('masterProfileId', sanitized.masterProfileId);
  pushString('kind', sanitized.kind as IMasterScheduleExceptionFiltersPreset['id']);

  const pushDate = (
    field: keyof IMasterScheduleExceptionPublicEntity & string,
    value: IMasterScheduleExceptionFiltersPreset['startsAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterScheduleExceptionPublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushDate('startsAt', sanitized.startsAt);
  pushDate('endsAt', sanitized.endsAt);
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
