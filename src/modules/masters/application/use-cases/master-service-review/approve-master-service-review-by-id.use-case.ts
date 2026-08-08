import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EMasterServiceReviewStatus,
  ensureMasterServiceReviewExists,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewPublicEntity } from 'src/modules/masters/domain/entities/master-service-review';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { IApproveMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/approve-master-service-review.input';
import type { RecalculateMasterRatingsUseCase } from './recalculate-master-ratings.use-case';

export class ApproveMasterServiceReviewByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
  ) {}

  async execute(
    input: IApproveMasterServiceReviewApplicationInput,
  ): Promise<IMasterServiceReviewPublicEntity> {
    const existing = await this.masterServiceReviewRepository.findEntityById(
      input.id,
    );
    ensureMasterServiceReviewExists(existing, input.id);

    const service = await this.masterServiceRepository.findEntityById(
      existing.masterServiceId,
    );
    ensureMasterServiceExists(service, existing.masterServiceId);

    return this.transactionManager.runInTransaction(async (scope) => {
      const review = await this.masterServiceReviewRepository.update(
        input.id,
        { status: EMasterServiceReviewStatus.ACTIVE },
        scope,
      );

      await this.recalculateMasterRatingsUseCase.execute({
        masterServiceId: existing.masterServiceId,
        masterProfileId: service.masterProfileId,
        scope,
      });

      return review;
    });
  }
}
