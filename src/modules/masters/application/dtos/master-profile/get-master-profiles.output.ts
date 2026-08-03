import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';

export type GetMasterProfilesOutput = {
  items: Array<
    IMasterProfilePublicEntity &
      Partial<IMasterProfileRelations> & {
        personalNote?: IUserPersonalNotePublicEntity | null;
      }
  >;
  total: number;
};
