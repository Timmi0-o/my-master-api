import type { IListQueryParams } from 'src/modules/shared/domain/list-query.params';

import {
  ICreateUserInput,
  IUserEntity,
  IUserListRow,
} from '../../entities/user';

export interface IUserRepository {
  create(user: ICreateUserInput): Promise<IUserEntity>;
  findById(userId: string): Promise<IUserEntity | null>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findManyAndCountForList(
    params: IListQueryParams,
  ): Promise<[IUserListRow[] | null, number]>;
  softDeleteById(userId: string): Promise<boolean>;
}
