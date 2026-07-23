import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import { MASTER_SUBSCRIPTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-subscription/master-subscription-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type MasterSubscriptionSelectOptions = SelectOptions<
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
): SelectOptions<
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations
> {
  const config = MASTER_SUBSCRIPTION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as MasterSubscriptionSelectOptions['select'],
    include: config.include,
  };
}

export { MASTER_SUBSCRIPTION_SELECT_FIELDS };
