import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
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
    id: string,
    input: IUpdateMasterProfileInput,
    sessionUser: ISessionUser,
    isStaffUser: boolean,
  ): Promise<IMasterProfileEntity> {
    const existing = await this.masterProfileRepository.findEntityById(id);
    if (!existing) {
      throw new MasterProfileNotFoundError(id);
    }

    assertMasterProfileAccess(existing, sessionUser, isStaffUser);

    const data: IUpdateMasterProfileInput = { ...input };
    if (!isStaffUser) {
      delete data.userId;
    }

    return this.masterProfileRepository.update(id, data);
  }
}
