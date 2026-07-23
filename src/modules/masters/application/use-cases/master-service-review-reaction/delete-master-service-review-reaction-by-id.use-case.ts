import {
  ensureMasterServiceReviewReactionExists,
  ensureMasterServiceReviewReactionModifiable,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { IMasterServiceReviewReactionRepository } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteMasterServiceReviewReactionApplicationInput } from '../../dtos/master-service-review-reaction/delete-master-service-review-reaction.input';
import type { IDeleteMasterServiceReviewReactionApplicationOutput } from '../../dtos/master-service-review-reaction/delete-master-service-review-reaction.output';

export class DeleteMasterServiceReviewReactionByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly reactionRepository: IMasterServiceReviewReactionRepository,
  ) {}

  async execute(
    input: IDeleteMasterServiceReviewReactionApplicationInput,
  ): Promise<IDeleteMasterServiceReviewReactionApplicationOutput> {
    const existing = await this.reactionRepository.findEntityById(input.id);
    ensureMasterServiceReviewReactionExists(existing, input.id);
    ensureMasterServiceReviewReactionModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.reactionRepository.softDelete(input.id, scope),
    );
  }
}
