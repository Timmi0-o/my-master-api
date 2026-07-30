import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import { wantsPersonalNotesEnrich } from 'src/modules/shared/domain/query';
import {
  resolvePersonalNoteForReference,
  type WithPersonalNote,
} from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { IGetUserProfileByIdApplicationInput } from '../../dtos/user-profile/get-user-profile-by-id.input';
import type { IGetUserProfileByIdApplicationOutput } from '../../dtos/user-profile/get-user-profile-by-id.output';

export class GetUserProfileByIdUseCase {
  constructor(
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetUserProfileByIdApplicationInput,
  ): Promise<WithPersonalNote<IGetUserProfileByIdApplicationOutput>> {
    const entity = await this.userProfileRepository.findEntityById(input.id);

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new UserProfileNotFoundError(input.id);
    }

    const item = await this.userProfileRepository.findOne(
      input.id,
      input.params,
    );

    if (!item) {
      throw new UserProfileNotFoundError(input.id);
    }

    if (!wantsPersonalNotesEnrich(input.params?.enrich)) {
      return {
        ...item,
        personalNote: null,
      };
    }

    const personalNote = await resolvePersonalNoteForReference(
      this.userPersonalNoteRepository,
      input.actor.userId || null,
      item.userId,
    );

    return {
      ...item,
      personalNote,
    };
  }
}
