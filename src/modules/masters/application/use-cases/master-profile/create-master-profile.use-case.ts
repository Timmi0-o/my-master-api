import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';

export type CreateMasterProfileCommand = {
  displayName: string;
  description: string;
  rating: number;
  userId?: string;
};

export class CreateMasterProfileUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    command: CreateMasterProfileCommand,
    sessionUser: ISessionUser,
    isStaffUser: boolean,
  ): Promise<IMasterProfileEntity> {
    const userId =
      isStaffUser && command.userId ? command.userId : sessionUser.id;

    const input: ICreateMasterProfileInput = {
      userId,
      displayName: command.displayName,
      description: command.description,
      rating: command.rating,
    };

    return this.masterProfileRepository.create(input);
  }
}
