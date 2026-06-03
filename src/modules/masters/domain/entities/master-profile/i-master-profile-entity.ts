export interface IMasterProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterProfilePublicEntity = IMasterProfileEntity;

export type ICreateMasterProfileInput = Omit<
  IMasterProfileEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateMasterProfileInput = Partial<
  Omit<ICreateMasterProfileInput, 'userId'>
> & {
  userId?: string;
};
