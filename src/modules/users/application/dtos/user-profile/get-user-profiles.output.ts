import type { WithPersonalNote } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';

export type GetUserProfilesOutput = {
  items: WithPersonalNote<
    IUserProfilePublicEntity & Partial<IUserProfileRelations>
  >[];
  total: number;
};
