import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';

export type IGetMasterProfileByIdApplicationOutput = IMasterProfilePublicEntity & {
  personalNote?: IUserPersonalNotePublicEntity | null;
};
