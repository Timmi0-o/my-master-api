import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IFavoriteMasterServiceFiltersPreset } from '../../validation/types/favorite-master-service-filters-preset.types';

export function extractFavoriteMasterServiceFilter(
  filter: IFavoriteMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IFavoriteMasterServicePublicEntity,
      IFavoriteMasterServiceRelations
    >
  | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IFavoriteMasterServicePublicEntity,
    IFavoriteMasterServiceRelations
  >[] = [];

  const pushString = (
    field: keyof IFavoriteMasterServicePublicEntity & string,
    value: IFavoriteMasterServiceFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IFavoriteMasterServicePublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('masterServiceId', sanitized.masterServiceId);

  const pushDate = (
    field: keyof IFavoriteMasterServicePublicEntity & string,
    value: IFavoriteMasterServiceFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IFavoriteMasterServicePublicEntity>(
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
