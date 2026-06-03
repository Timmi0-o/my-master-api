import type { ICreateMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/create-master-profile.input';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export class CreateMasterProfileUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterProfileApplicationInput,
  ): Promise<IMasterProfileEntity> {
    const userId =
      input.actor.isStaffUser && input.userId
        ? input.userId
        : input.actor.userId;

    const createInput: ICreateMasterProfileInput = {
      userId,
      displayName: input.displayName,
      description: input.description,
      rating: input.rating,
    };

    return this.masterProfileRepository.create(createInput);
  }
}
