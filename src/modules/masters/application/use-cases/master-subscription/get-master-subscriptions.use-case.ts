import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import type { GetMasterSubscriptionsOutput } from '../../dtos/master-subscription/get-master-subscriptions.output';

export class GetMasterSubscriptionsUseCase {
  constructor(
    private readonly masterSubscriptionRepository: IMasterSubscriptionRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IMasterSubscriptionPublicEntity,
      IMasterSubscriptionRelations
    >,
  ): Promise<GetMasterSubscriptionsOutput> {
    const [items, total] = await Promise.all([
      this.masterSubscriptionRepository.findMany(params),
      this.masterSubscriptionRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
