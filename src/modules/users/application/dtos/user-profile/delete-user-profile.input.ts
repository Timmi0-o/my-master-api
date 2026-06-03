import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IDeleteUserProfileApplicationInput {
  id: string;
  actor: IUserActorInput;
}
