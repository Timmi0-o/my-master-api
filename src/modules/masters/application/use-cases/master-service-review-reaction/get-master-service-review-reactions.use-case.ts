import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { IMasterServiceReviewReactionRepository } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import type { GetMasterServiceReviewReactionsOutput } from '../../dtos/master-service-review-reaction/get-master-service-review-reactions.output';

export class GetMasterServiceReviewReactionsUseCase {
  constructor(
    private readonly masterServiceReviewReactionRepository: IMasterServiceReviewReactionRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IMasterServiceReviewReactionPublicEntity,
      IMasterServiceReviewReactionRelations
    >,
  ): Promise<GetMasterServiceReviewReactionsOutput> {
    const [items, total] = await Promise.all([
      this.masterServiceReviewReactionRepository.findMany(params),
      this.masterServiceReviewReactionRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
