import {
  EMasterServiceReviewStatus,
  ensureMasterServiceReviewExists,
  ensureMasterServiceReviewModifiable,
} from 'src/modules/masters/domain/entities/master-service-review';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/delete-master-service-review.input';
import type { IDeleteMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/delete-master-service-review.output';
import type { RecalculateMasterRatingsUseCase } from './recalculate-master-ratings.use-case';

export class DeleteMasterServiceReviewByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
  ) {}

  async execute(
    input: IDeleteMasterServiceReviewApplicationInput,
  ): Promise<IDeleteMasterServiceReviewApplicationOutput> {
    const existing = await this.masterServiceReviewRepository.findEntityById(
      input.id,
    );
    ensureMasterServiceReviewExists(existing, input.id);
    ensureMasterServiceReviewModifiable(existing, input.actor);

    const service = await this.masterServiceRepository.findEntityById(
      existing.masterServiceId,
    );
    ensureMasterServiceExists(service, existing.masterServiceId);

    const wasActive = existing.status === EMasterServiceReviewStatus.ACTIVE;

    return this.transactionManager.runInTransaction(async (scope) => {
      const review = await this.masterServiceReviewRepository.softDelete(
        input.id,
        scope,
      );

      if (wasActive) {
        await this.recalculateMasterRatingsUseCase.execute({
          masterServiceId: existing.masterServiceId,
          masterProfileId: service.masterProfileId,
          scope,
        });
      }

      return review;
    });
  }
}
