import {
  ensureMasterServiceReviewExists,
  ensureMasterServiceReviewModifiable,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/delete-master-service-review.input';
import type { IDeleteMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/delete-master-service-review.output';

export class DeleteMasterServiceReviewByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
  ) {}

  async execute(
    input: IDeleteMasterServiceReviewApplicationInput,
  ): Promise<IDeleteMasterServiceReviewApplicationOutput> {
    const existing = await this.masterServiceReviewRepository.findEntityById(
      input.id,
    );
    ensureMasterServiceReviewExists(existing, input.id);
    ensureMasterServiceReviewModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceReviewRepository.softDelete(input.id, scope),
    );
  }
}
