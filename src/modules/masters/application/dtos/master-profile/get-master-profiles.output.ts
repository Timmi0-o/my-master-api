import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { WithPersonalNote } from 'src/modules/users/application/helpers/attach-personal-notes.helper';

export type GetMasterProfilesOutput = {
  items: WithPersonalNote<
    IMasterProfilePublicEntity & Partial<IMasterProfileRelations>
  >[];
  total: number;
};
