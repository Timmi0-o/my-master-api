import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapMultiNumberRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IMyMasterServiceFiltersPreset } from '../../validation/types/my-master-service-filters-preset.types';

export function extractMyMasterServiceFilter(
  filter: IMyMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IMasterServicePublicEntity, IMasterServiceRelations> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<IMasterServicePublicEntity, IMasterServiceRelations>[] =
    [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IMasterServicePublicEntity>(
      sanitized.search.value,
      ['name', 'description'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IMasterServicePublicEntity & string,
    value: IMyMasterServiceFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterServicePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('name', sanitized.name);

  if (sanitized.price) {
    const part = mapMultiNumberRangeFilter<IMasterServicePublicEntity>(
      'price',
      sanitized.price,
    );
    if (part) parts.push(part);
  }

  const pushDate = (
    field: keyof IMasterServicePublicEntity & string,
    value: IMyMasterServiceFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterServicePublicEntity>(field, value);
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
