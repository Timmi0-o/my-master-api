import type { IUserEntity } from './i-user.entity';

export type ICreateUserInput = Omit<
  IUserEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
