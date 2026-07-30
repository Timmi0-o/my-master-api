import type { IUserActorInput } from '../common/i-user-actor.input';
import type { TUserPersonalNoteContext } from 'src/modules/users/domain/entities/user-personal-note';

export interface IUpsertUserPersonalNoteApplicationInput {
  referenceUserId: string;
  context: TUserPersonalNoteContext;
  name?: string | null;
  note?: string | null;
  actor: IUserActorInput;
}
