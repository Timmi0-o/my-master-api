import type { IUpdateMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/update-master-profile.input';
import type {
  IMasterProfileEntity,
  IUpdateMasterProfileInput,
} from 'src/modules/masters/domain/entities/master-profile';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class UpdateMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterProfileApplicationInput,
  ): Promise<IMasterProfileEntity> {
    const existing = await this.masterProfileRepository.findEntityById(
      input.id,
    );
    if (!existing) {
      throw new MasterProfileNotFoundError(input.id);
    }

    assertMasterProfileAccess(existing, input.actor);

    const data: IUpdateMasterProfileInput = { ...input.patch };
    if (!input.actor.isStaffUser) {
      delete data.userId;
    }

    return this.masterProfileRepository.update(input.id, data);
  }
}
