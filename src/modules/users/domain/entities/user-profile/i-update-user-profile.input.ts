import type { ICreateUserProfileInput } from './i-create-user-profile.input';

export type IUpdateUserProfileInput = Omit<
  Partial<ICreateUserProfileInput>,
  'deletedAt'
>;
