import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';

export type GetUserProfilesOutput = {
  items: IUserProfilePublicEntity[];
  total: number;
};
