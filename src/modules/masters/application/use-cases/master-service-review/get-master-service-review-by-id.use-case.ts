import { MasterServiceReviewNotFoundError } from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { IGetMasterServiceReviewByIdApplicationInput } from '../../dtos/master-service-review/get-master-service-review-by-id.input';
import type { IGetMasterServiceReviewByIdApplicationOutput } from '../../dtos/master-service-review/get-master-service-review-by-id.output';

export class GetMasterServiceReviewByIdUseCase {
  constructor(
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
  ) {}

  async execute(
    input: IGetMasterServiceReviewByIdApplicationInput,
  ): Promise<IGetMasterServiceReviewByIdApplicationOutput> {
    const entity = await this.masterServiceReviewRepository.findEntityById(
      input.id,
    );
    if (!entity || (!input.isStaffUser && entity.deletedAt != null)) {
      throw new MasterServiceReviewNotFoundError(input.id);
    }

    const item = await this.masterServiceReviewRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new MasterServiceReviewNotFoundError(input.id);
    }

    return item;
  }
}
