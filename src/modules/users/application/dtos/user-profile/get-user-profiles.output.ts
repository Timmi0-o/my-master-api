import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';

export type GetUserProfilesOutput = {
  items: Array<
    IUserProfilePublicEntity &
      Partial<IUserProfileRelations> & {
        personalNote?: IUserPersonalNotePublicEntity | null;
      }
  >;
  total: number;
};
