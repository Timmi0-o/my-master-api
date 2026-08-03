import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_OWNER_EMAIL_VERIFIED_WHERE } from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { attachPersonalNotesByUserId } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { GetMasterProfilesOutput } from '../../dtos/master-profile/get-master-profiles.output';

export class GetMasterProfilesUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    params: FindManyParams<IMasterProfilePublicEntity, IMasterProfileRelations>,
    actorUserId?: string | null,
  ): Promise<GetMasterProfilesOutput> {
    const where = mergeWhereFilters(
      params.where,
      MASTER_OWNER_EMAIL_VERIFIED_WHERE,
    );
    const filteredParams = { ...params, where };

    const [items, total] = await Promise.all([
      this.masterProfileRepository.findMany(filteredParams),
      this.masterProfileRepository.count({ where }),
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
