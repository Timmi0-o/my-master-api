import { MasterProfileNotFoundError } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { enrichPersonalNotesByUserId } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetMasterProfileByIdApplicationInput } from '../../dtos/master-profile/get-master-profile-by-id.input';
import type { IGetMasterProfileByIdApplicationOutput } from '../../dtos/master-profile/get-master-profile-by-id.output';

export class GetMasterProfileByIdUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetMasterProfileByIdApplicationInput,
  ): Promise<IGetMasterProfileByIdApplicationOutput> {
    const entity = await this.masterProfileRepository.findEntityById(input.id);

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterProfileNotFoundError(input.id);
    }

    const item = await this.masterProfileRepository.findOne(
      input.id,
      input.params,
    );

    if (!item) {
      throw new MasterProfileNotFoundError(input.id);
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
