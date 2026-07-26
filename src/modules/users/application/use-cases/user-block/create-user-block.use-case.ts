import type {
  ITransactionManager,
  TransactionScope,
} from '@shared/domain/transactions';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import { ensureUserExists } from 'src/modules/users/domain/entities/user';
import {
  ensureCanCreateUserBlock,
  UserBlockAlreadyExistsError,
  type ICreateUserBlockInput,
  type IUserBlockEntity,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { ICreateUserBlockApplicationInput } from '../../dtos/user-block/create-user-block.input';
import type { ICreateUserBlockApplicationOutput } from '../../dtos/user-block/create-user-block.output';

export class CreateUserBlockUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly userRepository: IUserRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterSubscriptionRepository: IMasterSubscriptionRepository,
  ) {}

  async execute(
    input: ICreateUserBlockApplicationInput,
  ): Promise<ICreateUserBlockApplicationOutput> {
    ensureCanCreateUserBlock(input.blockedUserId, input.actor);

    const blockedUser = await this.userRepository.findEntityById(
      input.blockedUserId,
    );
    ensureUserExists(blockedUser, input.blockedUserId);

    const existing =
      await this.userBlockRepository.findEntityByBlockerAndBlocked(
        input.actor.userId,
        input.blockedUserId,
      );

    if (existing && existing.deletedAt == null) {
      throw new UserBlockAlreadyExistsError(
        input.actor.userId,
        input.blockedUserId,
      );
    }

    return this.transactionManager.runInTransaction(async (scope) => {
      let block: IUserBlockEntity;

      if (existing && existing.deletedAt != null) {
        block = await this.userBlockRepository.restore(existing.id, scope);
      } else {
        const createInput: ICreateUserBlockInput = {
          blockerUserId: input.actor.userId,
          blockedUserId: input.blockedUserId,
        };
        block = await this.userBlockRepository.create(createInput, scope);
      }

      await this.unsubscribeFromBlockedUserIfNeeded(
        input.actor.userId,
        input.blockedUserId,
        scope,
      );

      return block;
    });
  }

  private async unsubscribeFromBlockedUserIfNeeded(
    blockerUserId: string,
    blockedUserId: string,
    scope: TransactionScope,
  ): Promise<void> {
    const masterProfile =
      await this.masterProfileRepository.findEntityByUserId(
        blockedUserId,
        scope,
      );

    if (!masterProfile) {
      return;
    }

    const subscription =
      await this.masterSubscriptionRepository.findEntityByUserAndMasterProfileId(
        blockerUserId,
        masterProfile.id,
        scope,
      );

    if (subscription && subscription.deletedAt == null) {
      await this.masterSubscriptionRepository.softDelete(
        subscription.id,
        scope,
      );
    }
  }
}
