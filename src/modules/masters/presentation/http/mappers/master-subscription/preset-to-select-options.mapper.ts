import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import { MASTER_SUBSCRIPTION_SELECT_FIELDS, MASTER_SUBSCRIPTION_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-subscription/master-subscription-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type MasterSubscriptionSelectOptions = PresetReadOptions<
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations
>;

const MASTER_SUBSCRIPTION_PRESETS: Record<
  TPresetType,
  MasterSubscriptionSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'userId', 'masterProfileId'],
  },
  SHORT: {
    select: ['id', 'userId', 'masterProfileId', 'createdAt'],
  },
  BASE: {
    select: [...MASTER_SUBSCRIPTION_SELECT_FIELDS],
    include: {
      user: {
        select: ['id', 'username', 'name', 'surname', 'patronymic'] as const,
      },
      masterProfile: {
        select: [
          'id',
          'userId',
          'displayName',
          'description',
          'rating',
          'timezone',
          'bookingStatus',
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
): PresetReadOptions<
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations
> {
  const config = MASTER_SUBSCRIPTION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    MASTER_SUBSCRIPTION_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as MasterSubscriptionSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { MASTER_SUBSCRIPTION_SELECT_FIELDS };
