export interface IUserBlockEntity {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IUserBlockPublicEntity = IUserBlockEntity;
