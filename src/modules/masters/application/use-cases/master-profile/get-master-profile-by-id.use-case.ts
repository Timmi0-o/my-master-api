import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { FindOneParams } from 'src/modules/shared/domain/query';

export class GetMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    id: string,
    isStaffUser: boolean,
    params?: FindOneParams<IMasterProfilePublicEntity, Record<never, never>>,
  ): Promise<IMasterProfilePublicEntity> {
    const entity = await this.masterProfileRepository.findEntityById(id);

    if (!entity || (!isStaffUser && entity.deletedAt != null)) {
      throw new MasterProfileNotFoundError(id);
    }

    const item = await this.masterProfileRepository.findOne(id, params);
    if (!item) {
      throw new MasterProfileNotFoundError(id);
    }
    return item;
  }
}
