import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';

export type GetUserBlocksOutput = {
  items: (IUserBlockPublicEntity & Partial<IUserBlockRelations>)[];
  total: number;
};
