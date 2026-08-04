import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { enrichPersonalNotesByUserId } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
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
  ): Promise<IGetUserProfileByIdApplicationOutput> {
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

    const [enriched] = await applyReadEnrichments(
      [item],
      {
        enrich: input.params?.enrich,
        actorUserId: input.actor.userId || null,
      },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.personalNotes),
          apply: (current, ctx) =>
            enrichPersonalNotesByUserId(
              this.userPersonalNoteRepository,
              ctx.actorUserId,
              current,
            ),
        },
      ],
    );

    return enriched;
  }
}
