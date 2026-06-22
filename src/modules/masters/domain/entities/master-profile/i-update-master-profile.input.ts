import type { ICreateMasterProfileInput } from './i-create-master-profile.input';

export type IUpdateMasterProfileInput = Partial<
  Omit<ICreateMasterProfileInput, 'userId'>
> & {
  userId?: string;
};
