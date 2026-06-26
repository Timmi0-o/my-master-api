import {
  ensureMasterServiceReviewExists,
  ensureMasterServiceReviewModifiable,
  ensureValidReviewRating,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/update-master-service-review.input';
import type { IUpdateMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/update-master-service-review.output';

export class UpdateMasterServiceReviewByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
  ) {}

  async execute(
    input: IUpdateMasterServiceReviewApplicationInput,
  ): Promise<IUpdateMasterServiceReviewApplicationOutput> {
    const existing = await this.masterServiceReviewRepository.findEntityById(
      input.id,
    );
    ensureMasterServiceReviewExists(existing, input.id);
    ensureMasterServiceReviewModifiable(existing, input.actor);

    if (input.patch.rating !== undefined) {
      ensureValidReviewRating(input.patch.rating);
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceReviewRepository.update(input.id, input.patch, scope),
    );
  }
}
