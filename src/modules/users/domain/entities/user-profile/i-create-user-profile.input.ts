import type { IUserProfileEntity } from './i-user-profile.entity';

export type ICreateUserProfileInput = Omit<
  IUserProfileEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
