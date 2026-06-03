import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { GetMasterProfilesOutput } from '../../dtos/master-profile/get-master-profiles.output';

export class GetMasterProfilesUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    params: FindManyParams<IMasterProfilePublicEntity, Record<never, never>>,
  ): Promise<GetMasterProfilesOutput> {
    const [items, total] = await Promise.all([
      this.masterProfileRepository.findMany(params),
      this.masterProfileRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
