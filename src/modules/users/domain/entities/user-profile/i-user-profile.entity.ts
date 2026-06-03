export interface IUserProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  rating: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IUserProfilePublicEntity = IUserProfileEntity;

export type ICreateUserProfileInput = Omit<
  IUserProfileEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateUserProfileInput = Omit<
  Partial<ICreateUserProfileInput>,
  'deletedAt'
>;
