import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IDeleteUserBlockApplicationInput {
  id: string;
  actor: IUserActorInput;
}
