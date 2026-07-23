import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterServiceReviewReactionInput,
  IMasterServiceReviewReactionEntity,
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
  IUpdateMasterServiceReviewReactionInput,
} from '../../entities/master-service-review-reaction';

export type MasterServiceReviewReactionStats = {
  likesCount: number;
  dislikesCount: number;
};

export type IMasterServiceReviewReactionRepository = IReadRepository<
  IMasterServiceReviewReactionPublicEntity,
  string,
  IMasterServiceReviewReactionRelations
> &
  ICreateRepository<
    IMasterServiceReviewReactionEntity,
    ICreateMasterServiceReviewReactionInput
  > &
  IUpdateRepository<
    IMasterServiceReviewReactionEntity,
    string,
    IUpdateMasterServiceReviewReactionInput
  > &
  ISoftDeleteRepository<IMasterServiceReviewReactionEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterServiceReviewReactionEntity | null>;
    findEntityByUserAndReviewId(
      userId: string,
      masterServiceReviewId: string,
      scope?: TransactionScope,
    ): Promise<IMasterServiceReviewReactionEntity | null>;
    restore(
      id: string,
      scope: TransactionScope,
    ): Promise<IMasterServiceReviewReactionEntity>;
    getStatsByReviewIds(
      reviewIds: readonly string[],
      scope?: TransactionScope,
    ): Promise<Map<string, MasterServiceReviewReactionStats>>;
  };
