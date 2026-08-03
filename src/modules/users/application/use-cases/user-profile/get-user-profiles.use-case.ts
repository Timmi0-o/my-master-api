import type { FindManyParams } from 'src/modules/shared/domain/query';
import { attachPersonalNotesByUserId } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { GetUserProfilesOutput } from '../../dtos/user-profile/get-user-profiles.output';

export class GetUserProfilesUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    params: FindManyParams<IUserProfilePublicEntity, IUserProfileRelations>,
    actorUserId?: string | null,
  ): Promise<GetUserProfilesOutput> {
    const [items, total] = await Promise.all([
      this.userProfileRepository.findMany(params),
      this.userProfileRepository.count({ where: params.where }),
    ]);

    if (!params.enrich?.personalNotes) {
      return { items, total };
    }

    const itemsWithNotes = await attachPersonalNotesByUserId(
      this.userPersonalNoteRepository,
      actorUserId,
      items,
    );

    return { items: itemsWithNotes, total };
  }
}
