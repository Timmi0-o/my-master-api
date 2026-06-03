import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type {
  ICreateUserInput,
  IUserEntity,
  IUserPublicEntity,
} from '../../entities/user';

export type IUserRepository = IReadRepository<
  IUserPublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(userId: string): Promise<IUserEntity | null>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findByEmailOrUsername(identifier: string): Promise<IUserEntity | null>;
  findSessionUserById(userId: string): Promise<ISessionUser | null>;
  create(user: ICreateUserInput): Promise<IUserEntity>;
  softDeleteById(userId: string): Promise<boolean>;
};
