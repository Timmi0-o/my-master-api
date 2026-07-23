import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import { FAVORITE_MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/favorite-master-service/favorite-master-service-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type FavoriteMasterServiceSelectOptions = SelectOptions<
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations
>;

const FAVORITE_MASTER_SERVICE_PRESETS: Record<
  TPresetType,
  FavoriteMasterServiceSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'userId', 'masterServiceId'],
  },
  SHORT: {
    select: ['id', 'userId', 'masterServiceId', 'createdAt'],
  },
  BASE: {
    select: [...FAVORITE_MASTER_SERVICE_SELECT_FIELDS],
    include: {
      user: {
        select: ['id', 'username', 'name', 'surname', 'patronymic'] as const,
      },
      masterService: {
        select: [
          'id',
          'name',
          'description',
          'price',
          'durationMinutes',
          'masterProfileId',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as const,
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations
> {
  const config = FAVORITE_MASTER_SERVICE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as FavoriteMasterServiceSelectOptions['select'],
    include: config.include,
  };
}

export { FAVORITE_MASTER_SERVICE_SELECT_FIELDS };
