import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class DeleteMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    id: string,
    sessionUser: ISessionUser,
    isStaffUser: boolean,
  ): Promise<boolean> {
    const existing = await this.masterProfileRepository.findEntityById(id);
    if (!existing) {
      throw new MasterProfileNotFoundError(id);
    }

    assertMasterProfileAccess(existing, sessionUser, isStaffUser);

    return this.masterProfileRepository.softDeleteById(id);
  }
}
