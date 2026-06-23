import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import { IGetMyServicesApplicationInput } from '../../dtos/master-service/get-my-services.input';
import { IGetMyServicesApplicationOutput } from '../../dtos/master-service/get-my-services.output';

export class GetMyServicesUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetMyServicesApplicationInput,
  ): Promise<IGetMyServicesApplicationOutput> {
    const profile = await this.masterProfileRepository.findEntityByUserId(
      input.actor.userId,
    );

    if (!profile || (!input.actor.isStaffUser && profile.deletedAt != null)) {
      return { items: [], total: 0 };
    }

    const params = {
      ...input.params,
      where: mergeWhereFilters(input.params.where, {
        masterProfileId: { eq: profile.id },
      }),
    };

    const [items, total] = await Promise.all([
      this.masterServiceRepository.findMany(params),
      this.masterServiceRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
