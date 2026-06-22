import type { IGetMasterProfileByIdApplicationInput } from '../../dtos/master-profile/get-master-profile-by-id.input';
import type { IGetMasterProfileByIdApplicationOutput } from '../../dtos/master-profile/get-master-profile-by-id.output';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class GetMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetMasterProfileByIdApplicationInput,
  ): Promise<IGetMasterProfileByIdApplicationOutput> {
    const entity = await this.masterProfileRepository.findEntityById(input.id);

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterProfileNotFoundError(input.id);
    }

    const item = await this.masterProfileRepository.findOne(
      input.id,
      input.params,
    );

    if (!item) {
      throw new MasterProfileNotFoundError(input.id);
    }
    return item;
  }
}
