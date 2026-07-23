import type {
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import { MASTER_SERVICE_REVIEW_REACTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-review-reaction/master-service-review-reaction-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type ReactionSelectOptions = SelectOptions<
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations
>;

const MASTER_SERVICE_REVIEW_REACTION_PRESETS: Record<
  TPresetType,
  ReactionSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'userId', 'masterServiceReviewId', 'type'],
  },
  SHORT: {
    select: ['id', 'userId', 'masterServiceReviewId', 'type', 'createdAt'],
  },
  BASE: {
    select: [...MASTER_SERVICE_REVIEW_REACTION_SELECT_FIELDS],
    include: {
      user: {
        select: ['id', 'username', 'name', 'surname', 'patronymic'] as const,
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations
> {
  const config = MASTER_SERVICE_REVIEW_REACTION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as ReactionSelectOptions['select'],
    include: config.include,
  };
}
