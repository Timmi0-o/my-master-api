import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import { MASTER_SERVICE_REVIEW_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type MasterServiceReviewSelectOptions = SelectOptions<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
>;

const MASTER_SERVICE_REVIEW_PRESETS: Record<
  TPresetType,
  MasterServiceReviewSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'masterServiceId', 'appointmentId', 'rating', 'text'],
  },
  SHORT: {
    select: [
      'id',
      'clientUserId',
      'masterServiceId',
      'appointmentId',
      'rating',
      'text',
      'createdAt',
    ],
  },
  BASE: {
    select: [...MASTER_SERVICE_REVIEW_SELECT_FIELDS],
    include: {
      clientUser: {
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
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> {
  const config = MASTER_SERVICE_REVIEW_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as MasterServiceReviewSelectOptions['select'],
    include: config.include,
  };
}

export { MASTER_SERVICE_REVIEW_SELECT_FIELDS };
