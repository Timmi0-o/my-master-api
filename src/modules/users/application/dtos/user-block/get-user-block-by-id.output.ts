import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';

export type IGetUserBlockByIdApplicationOutput = IUserBlockPublicEntity &
  Partial<IUserBlockRelations>;
