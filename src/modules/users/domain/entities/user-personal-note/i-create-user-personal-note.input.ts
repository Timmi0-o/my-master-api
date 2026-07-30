import type {
  IUserPersonalNoteContextMap,
  TUserPersonalNoteContext,
} from './i-user-personal-note.entity';

export interface ICreateUserPersonalNoteInput {
  ownerUserId: string;
  referenceUserId: string;
  names: IUserPersonalNoteContextMap;
  notes?: IUserPersonalNoteContextMap | null;
}

export interface IUpdateUserPersonalNoteInput {
  names: IUserPersonalNoteContextMap;
  notes?: IUserPersonalNoteContextMap | null;
  deletedAt?: Date | null;
}

export type { TUserPersonalNoteContext };
