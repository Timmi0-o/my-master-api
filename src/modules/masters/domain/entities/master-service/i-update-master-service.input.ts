import type { ICreateMasterServiceInput } from './i-create-master-service.input';

export type IUpdateMasterServiceInput = Partial<
  Omit<ICreateMasterServiceInput, 'masterProfileId'>
>;
