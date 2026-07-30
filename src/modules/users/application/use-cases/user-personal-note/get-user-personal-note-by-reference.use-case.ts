import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetUserPersonalNoteByReferenceApplicationInput } from '../../dtos/user-personal-note/get-user-personal-note-by-reference.input';
import type { IGetUserPersonalNoteByReferenceApplicationOutput } from '../../dtos/user-personal-note/get-user-personal-note-by-reference.output';

export class GetUserPersonalNoteByReferenceUseCase {
  constructor(
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetUserPersonalNoteByReferenceApplicationInput,
  ): Promise<IGetUserPersonalNoteByReferenceApplicationOutput> {
    const existing =
      await this.userPersonalNoteRepository.findEntityByOwnerAndReference(
        input.actor.userId,
        input.referenceUserId,
      );

    if (!existing || existing.deletedAt != null) {
      return null;
    }

    return existing;
  }
}
