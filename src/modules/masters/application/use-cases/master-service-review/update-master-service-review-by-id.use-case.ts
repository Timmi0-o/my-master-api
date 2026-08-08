import {
  EMasterServiceReviewStatus,
  ensureMasterServiceReviewExists,
  ensureMasterServiceReviewModifiable,
  ensureValidReviewRating,
  resolveMasterServiceReviewStatusOnUpdate,
} from 'src/modules/masters/domain/entities/master-service-review';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/update-master-service-review.input';
import type { IUpdateMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/update-master-service-review.output';
import type { RecalculateMasterRatingsUseCase } from './recalculate-master-ratings.use-case';

export class UpdateMasterServiceReviewByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
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

    const service = await this.masterServiceRepository.findEntityById(
      existing.masterServiceId,
    );
    ensureMasterServiceExists(service, existing.masterServiceId);

    const nextStatus = resolveMasterServiceReviewStatusOnUpdate(
      existing.status,
      input.patch,
    );
    const leftActive =
      existing.status === EMasterServiceReviewStatus.ACTIVE &&
      nextStatus !== EMasterServiceReviewStatus.ACTIVE;
    const shouldRecalculate =
      leftActive ||
      (input.patch.rating !== undefined &&
        nextStatus === EMasterServiceReviewStatus.ACTIVE);

    return this.transactionManager.runInTransaction(async (scope) => {
      const review = await this.masterServiceReviewRepository.update(
        input.id,
        { ...input.patch, status: nextStatus },
        scope,
      );

      if (shouldRecalculate) {
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
