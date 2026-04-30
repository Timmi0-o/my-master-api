import { ICreateUserInput, IUserEntity } from '../../entities/user';

export interface IUserRepository {
  create(user: ICreateUserInput): Promise<IUserEntity>;
  findById(userId: string): Promise<IUserEntity | null>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findMany(): Promise<IUserEntity[]>;
  softDeleteById(userId: string): Promise<boolean>;
}
