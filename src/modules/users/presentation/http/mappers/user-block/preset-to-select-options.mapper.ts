import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import { USER_BLOCK_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-block/user-block-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type UserBlockSelectOptions = SelectOptions<
  IUserBlockPublicEntity,
  IUserBlockRelations
>;

const USER_PUBLIC_SELECT = [
  'id',
  'username',
  'name',
  'surname',
  'patronymic',
] as const;

const USER_BLOCK_PRESETS: Record<TPresetType, UserBlockSelectOptions> = {
  MINIMAL: {
    select: ['id', 'blockerUserId', 'blockedUserId'],
  },
  SHORT: {
    select: ['id', 'blockerUserId', 'blockedUserId', 'createdAt'],
  },
  BASE: {
    select: [...USER_BLOCK_SELECT_FIELDS],
    include: {
      blocker: {
        select: USER_PUBLIC_SELECT,
      },
      blocked: {
        select: USER_PUBLIC_SELECT,
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IUserBlockPublicEntity, IUserBlockRelations> {
  const config = USER_BLOCK_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as UserBlockSelectOptions['select'],
    include: config.include,
  };
}

export { USER_BLOCK_SELECT_FIELDS };
