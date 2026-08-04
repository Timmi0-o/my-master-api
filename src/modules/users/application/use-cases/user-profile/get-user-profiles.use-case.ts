import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { enrichPersonalNotesByUserId } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
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

    const enriched = await applyReadEnrichments(
      items,
      { enrich: params.enrich, actorUserId },
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

    return { items: enriched, total };
  }
}
