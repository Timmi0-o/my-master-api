import type { ITransactionManager } from '@shared/domain/transactions';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import {
  ensureActorHasNotBlockedMaster,
  ensureCanSubscribeToMaster,
  MasterSubscriptionAlreadyExistsError,
  type ICreateMasterSubscriptionInput,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { ICreateMasterSubscriptionApplicationInput } from '../../dtos/master-subscription/create-master-subscription.input';
import type { ICreateMasterSubscriptionApplicationOutput } from '../../dtos/master-subscription/create-master-subscription.output';

export class CreateMasterSubscriptionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterSubscriptionRepository: IMasterSubscriptionRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userBlockRepository: IUserBlockRepository,
  ) {}

  async execute(
    input: ICreateMasterSubscriptionApplicationInput,
  ): Promise<ICreateMasterSubscriptionApplicationOutput> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    ensureMasterProfileExists(profile, input.masterProfileId);
    ensureCanSubscribeToMaster(profile, input.actor);

    await ensureActorHasNotBlockedMaster(
      this.userBlockRepository,
      input.actor.userId,
      profile.userId,
    );

    const existing =
      await this.masterSubscriptionRepository.findEntityByUserAndMasterProfileId(
        input.actor.userId,
        input.masterProfileId,
      );

    if (existing && existing.deletedAt == null) {
      throw new MasterSubscriptionAlreadyExistsError(
        input.actor.userId,
        input.masterProfileId,
      );
    }

    if (existing && existing.deletedAt != null) {
      return this.transactionManager.runInTransaction((scope) =>
        this.masterSubscriptionRepository.restore(existing.id, scope),
      );
    }

    const createInput: ICreateMasterSubscriptionInput = {
      userId: input.actor.userId,
      masterProfileId: input.masterProfileId,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterSubscriptionRepository.create(createInput, scope),
    );
  }
}
