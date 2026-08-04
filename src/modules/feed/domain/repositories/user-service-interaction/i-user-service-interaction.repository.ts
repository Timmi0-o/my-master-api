import type { EUserServiceInteractionType } from '../../entities/user-service-interaction';
import type {
  ICreateUserServiceInteractionInput,
  IUserServiceInteractionEntity,
} from '../../entities/user-service-interaction';

export interface IUserServiceInteractionRepository {
  createMany(
    inputs: ICreateUserServiceInteractionInput[],
  ): Promise<IUserServiceInteractionEntity[]>;

  findRecentDuplicate(
    userId: string,
    masterServiceId: string,
    type: EUserServiceInteractionType,
    since: Date,
  ): Promise<IUserServiceInteractionEntity | null>;

  findRecentByUserId(
    userId: string,
    since: Date,
    limit?: number,
  ): Promise<IUserServiceInteractionEntity[]>;
}
