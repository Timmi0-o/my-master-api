import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type {
  ICreateUserProfileInput,
  IUpdateUserProfileInput,
  IUserProfileEntity,
  IUserProfilePublicEntity,
} from '../../entities/user-profile';

export type IUserProfileRepository = IReadRepository<
  IUserProfilePublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(id: string): Promise<IUserProfileEntity | null>;
  findEntityByUserId(userId: string): Promise<IUserProfileEntity | null>;
  create(input: ICreateUserProfileInput): Promise<IUserProfileEntity>;
  update(
    id: string,
    input: IUpdateUserProfileInput,
  ): Promise<IUserProfileEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
