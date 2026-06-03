import type { IUpdateUserProfileInput } from 'src/modules/users/domain/entities/user-profile';
import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IUpdateUserProfileApplicationInput {
  id: string;
  patch: IUpdateUserProfileInput;
  actor: IUserActorInput;
}
