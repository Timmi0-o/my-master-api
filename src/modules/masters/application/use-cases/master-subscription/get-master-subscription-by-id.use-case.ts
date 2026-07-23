import { MasterSubscriptionNotFoundError } from 'src/modules/masters/domain/entities/master-subscription';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import type { IGetMasterSubscriptionByIdApplicationInput } from '../../dtos/master-subscription/get-master-subscription-by-id.input';
import type { IGetMasterSubscriptionByIdApplicationOutput } from '../../dtos/master-subscription/get-master-subscription-by-id.output';

export class GetMasterSubscriptionByIdUseCase {
  constructor(
    private readonly masterSubscriptionRepository: IMasterSubscriptionRepository,
  ) {}

  async execute(
    input: IGetMasterSubscriptionByIdApplicationInput,
  ): Promise<IGetMasterSubscriptionByIdApplicationOutput> {
    const entity = await this.masterSubscriptionRepository.findEntityById(
      input.id,
    );
    if (!entity || (!input.isStaffUser && entity.deletedAt != null)) {
      throw new MasterSubscriptionNotFoundError(input.id);
    }

    const item = await this.masterSubscriptionRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new MasterSubscriptionNotFoundError(input.id);
    }

    return item;
  }
}
