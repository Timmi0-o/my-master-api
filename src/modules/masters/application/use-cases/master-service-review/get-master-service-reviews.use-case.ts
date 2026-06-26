import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { GetMasterServiceReviewsOutput } from '../../dtos/master-service-review/get-master-service-reviews.output';

export class GetMasterServiceReviewsUseCase {
  constructor(
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IMasterServiceReviewPublicEntity,
      IMasterServiceReviewRelations
    >,
  ): Promise<GetMasterServiceReviewsOutput> {
    const [items, total] = await Promise.all([
      this.masterServiceReviewRepository.findMany(params),
      this.masterServiceReviewRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
