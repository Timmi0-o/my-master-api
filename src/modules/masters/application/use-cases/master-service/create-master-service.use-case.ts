import type { ICreateMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/master-service/create-master-service.input';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
} from 'src/modules/masters/domain/entities/master-service';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class CreateMasterServiceUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterServiceApplicationInput,
  ): Promise<IMasterServiceEntity> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(input.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    const createInput: ICreateMasterServiceInput = {
      masterProfileId: input.masterProfileId,
      name: input.name,
      description: input.description,
      price: input.price,
      durationMinutes: input.durationMinutes ?? 60,
    };

    return this.masterServiceRepository.create(createInput);
  }
}
