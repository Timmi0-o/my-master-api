import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IGetMyUserProfileApplicationInput {
  actor: IUserActorInput;
  params?: FindOneParams<IUserProfilePublicEntity, Record<never, never>>;
}
