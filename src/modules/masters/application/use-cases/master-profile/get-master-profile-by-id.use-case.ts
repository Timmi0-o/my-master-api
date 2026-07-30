import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/entities/master-profile';
import { wantsPersonalNotesEnrich } from 'src/modules/shared/domain/query';
import {
  resolvePersonalNoteForReference,
  type WithPersonalNote,
} from 'src/modules/users/application/helpers/attach-personal-notes.helper';
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
  ): Promise<WithPersonalNote<IGetMasterProfileByIdApplicationOutput>> {
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
