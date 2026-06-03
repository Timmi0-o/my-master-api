import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type {
  IMasterServiceEntity,
  IUpdateMasterServiceInput,
} from 'src/modules/masters/domain/entities/master-service';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class UpdateMasterServiceByIdUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    id: string,
    input: IUpdateMasterServiceInput,
    sessionUser: ISessionUser,
    isStaffUser: boolean,
  ): Promise<IMasterServiceEntity> {
    const existing = await this.masterServiceRepository.findEntityById(id);
    if (!existing) {
      throw new MasterServiceNotFoundError(id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(existing.masterProfileId);
    }

    assertMasterProfileAccess(profile, sessionUser, isStaffUser);

    return this.masterServiceRepository.update(id, input);
  }
}
