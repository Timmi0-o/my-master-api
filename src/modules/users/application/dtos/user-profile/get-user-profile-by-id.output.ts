import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';

export type IGetUserProfileByIdApplicationOutput = IUserProfilePublicEntity & {
  personalNote?: IUserPersonalNotePublicEntity | null;
};
