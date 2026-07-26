import type { IUserActorInput } from '../common/i-user-actor.input';

export interface ICreateUserBlockApplicationInput {
  blockedUserId: string;
  actor: IUserActorInput;
}
