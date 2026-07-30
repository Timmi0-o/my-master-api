import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import { MASTER_SERVICE_REVIEW_SELECT_FIELDS, MASTER_SERVICE_REVIEW_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';

type MasterServiceReviewSelectOptions = PresetReadOptions<
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
): PresetReadOptions<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> {
  const config = MASTER_SERVICE_REVIEW_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    MASTER_SERVICE_REVIEW_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as MasterServiceReviewSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { MASTER_SERVICE_REVIEW_SELECT_FIELDS };
