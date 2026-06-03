import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
} from 'src/modules/masters/domain/entities/master-service';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export type CreateMasterServiceCommand = {
  masterProfileId: string;
  name: string;
  description: string;
  price: number;
};

export class CreateMasterServiceUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    command: CreateMasterServiceCommand,
    sessionUser: ISessionUser,
    isStaffUser: boolean,
  ): Promise<IMasterServiceEntity> {
    const profile = await this.masterProfileRepository.findEntityById(
      command.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(command.masterProfileId);
    }

    assertMasterProfileAccess(profile, sessionUser, isStaffUser);

    const input: ICreateMasterServiceInput = {
      masterProfileId: command.masterProfileId,
      name: command.name,
      description: command.description,
      price: command.price,
    };

    return this.masterServiceRepository.create(input);
  }
}
