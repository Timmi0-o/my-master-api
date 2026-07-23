import {
  ensureActorOrderedMasterService,
  ensureMasterServiceReviewReactionExists,
  type ICreateMasterServiceReviewReactionInput,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import { ensureMasterServiceReviewExists } from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewReactionRepository } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpsertMasterServiceReviewReactionApplicationInput } from '../../dtos/master-service-review-reaction/upsert-master-service-review-reaction.input';
import type { IUpsertMasterServiceReviewReactionApplicationOutput } from '../../dtos/master-service-review-reaction/upsert-master-service-review-reaction.output';

export class UpsertMasterServiceReviewReactionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly reactionRepository: IMasterServiceReviewReactionRepository,
    private readonly reviewRepository: IMasterServiceReviewRepository,
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(
    input: IUpsertMasterServiceReviewReactionApplicationInput,
  ): Promise<IUpsertMasterServiceReviewReactionApplicationOutput> {
    const review = await this.reviewRepository.findEntityById(
      input.masterServiceReviewId,
    );
    ensureMasterServiceReviewExists(review, input.masterServiceReviewId);

    const hasOrderedService =
      await this.appointmentRepository.existsByClientUserIdAndMasterServiceId(
        input.actor.userId,
        review.masterServiceId,
      );
    ensureActorOrderedMasterService(hasOrderedService, review.masterServiceId);

    const existing = await this.reactionRepository.findEntityByUserAndReviewId(
      input.actor.userId,
      input.masterServiceReviewId,
    );

    if (!existing) {
      const createInput: ICreateMasterServiceReviewReactionInput = {
        userId: input.actor.userId,
        masterServiceReviewId: input.masterServiceReviewId,
        type: input.type,
      };

      return this.transactionManager.runInTransaction((scope) =>
        this.reactionRepository.create(createInput, scope),
      );
    }

    if (existing.deletedAt != null) {
      return this.transactionManager.runInTransaction(async (scope) => {
        await this.reactionRepository.restore(existing.id, scope);
        if (existing.type !== input.type) {
          return this.reactionRepository.update(
            existing.id,
            { type: input.type },
            scope,
          );
        }
        const restored = await this.reactionRepository.findEntityById(
          existing.id,
          scope,
        );
        ensureMasterServiceReviewReactionExists(restored, existing.id);
        return restored;
      });
    }

    if (existing.type === input.type) {
      await this.transactionManager.runInTransaction((scope) =>
        this.reactionRepository.softDelete(existing.id, scope),
      );
      return null;
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.reactionRepository.update(
        existing.id,
        { type: input.type },
        scope,
      ),
    );
  }
}
