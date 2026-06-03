import type { IDeleteMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/delete-master-profile.input';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class DeleteMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IDeleteMasterProfileApplicationInput): Promise<boolean> {
    const existing = await this.masterProfileRepository.findEntityById(
      input.id,
    );
    if (!existing) {
      throw new MasterProfileNotFoundError(input.id);
    }

    assertMasterProfileAccess(existing, input.actor);

    return this.masterProfileRepository.softDeleteById(input.id);
  }
}
