import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { GetUserProfilesOutput } from '../../dtos/user-profile/get-user-profiles.output';

export class GetUserProfilesUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    params: FindManyParams<IUserProfilePublicEntity, IUserProfileRelations>,
  ): Promise<GetUserProfilesOutput> {
    const [items, total] = await Promise.all([
      this.userProfileRepository.findMany(params),
      this.userProfileRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
