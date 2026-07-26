import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';

export interface IGetUserBlockByIdApplicationInput {
  id: string;
  isStaffUser: boolean;
  actorUserId: string;
  params: FindOneParams<IUserBlockPublicEntity, IUserBlockRelations>;
}
