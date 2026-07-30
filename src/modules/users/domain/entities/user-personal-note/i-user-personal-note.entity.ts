export type TUserPersonalNoteContext = 'master' | 'client';

export interface IUserPersonalNoteContextMap {
  master?: string;
  client?: string;
}

export interface IUserPersonalNoteEntity {
  id: string;
  ownerUserId: string;
  referenceUserId: string;
  names: IUserPersonalNoteContextMap;
  notes: IUserPersonalNoteContextMap | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IUserPersonalNotePublicEntity = IUserPersonalNoteEntity;
