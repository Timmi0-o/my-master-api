import type { ICreateUserInput } from './i-create-user.input';

export type IUpdateUserInput = Omit<Partial<ICreateUserInput>, 'deletedAt'>;
