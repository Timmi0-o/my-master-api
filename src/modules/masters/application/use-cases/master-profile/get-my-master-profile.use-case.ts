import type { IGetMyMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/get-my-master-profile.input';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class GetMyMasterProfileUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IGetMyMasterProfileApplicationInput,
  ): Promise<IMasterProfilePublicEntity | null> {
    const entity = await this.masterProfileRepository.findEntityByUserId(
      input.actor.userId,
    );

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      return null;
    }

    const item = await this.masterProfileRepository.findOne(
      entity.id,
      input.params,
    );

    return item ?? null;
  }
}
