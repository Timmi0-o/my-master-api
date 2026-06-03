import type { IDeleteMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/master-service/delete-master-service.input';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class DeleteMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IDeleteMasterServiceApplicationInput): Promise<boolean> {
    const existing = await this.masterServiceRepository.findEntityById(
      input.id,
    );
    if (!existing) {
      throw new MasterServiceNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(existing.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    return this.masterServiceRepository.softDeleteById(input.id);
  }
}
