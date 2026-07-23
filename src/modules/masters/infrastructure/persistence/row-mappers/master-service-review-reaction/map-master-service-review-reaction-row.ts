import type {
  IMasterServiceReviewReactionEntity,
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import { mapMasterServiceReviewRow } from '../master-service-review/map-master-service-review-row';
import type { MasterServiceReviewRow } from '../master-service-review/master-service-review.row.types';
import type { MasterServiceReviewReactionRow } from './master-service-review-reaction.row.types';

function mapUserRelation(
  row: NonNullable<MasterServiceReviewReactionRow['user']>,
): IMasterServiceReviewReactionRelations['user'] {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
  };
}

export function mapMasterServiceReviewReactionRow(
  row: MasterServiceReviewReactionRow,
): IMasterServiceReviewReactionPublicEntity &
  Partial<IMasterServiceReviewReactionRelations> {
  const entity: IMasterServiceReviewReactionEntity &
    Partial<IMasterServiceReviewReactionRelations> = {
    id: row.id,
    userId: row.userId,
    masterServiceReviewId: row.masterServiceReviewId,
    type: row.type,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.user != null) {
    entity.user = mapUserRelation(row.user);
  }

  if (row.masterServiceReview != null) {
    entity.masterServiceReview = mapMasterServiceReviewRow(
      row.masterServiceReview as MasterServiceReviewRow,
    );
  }

  return entity;
}
