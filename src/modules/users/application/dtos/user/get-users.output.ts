import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';

export interface GetUsersOutput {
  items: IUserPublicEntity[];
  total: number;
}
