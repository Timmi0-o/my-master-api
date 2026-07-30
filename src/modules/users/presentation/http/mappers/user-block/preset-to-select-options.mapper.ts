import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import { USER_BLOCK_SELECT_FIELDS, USER_BLOCK_STAFF_ONLY_FIELDS } from 'src/modules/users/domain/entities/user-block/user-block-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type UserBlockSelectOptions = PresetReadOptions<
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
): PresetReadOptions<IUserBlockPublicEntity, IUserBlockRelations> {
  const config = USER_BLOCK_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    USER_BLOCK_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as UserBlockSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { USER_BLOCK_SELECT_FIELDS };
