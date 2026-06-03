import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IUpdateMasterProfileInput,
} from '../../entities/master-profile';

export type IMasterProfileRepository = IReadRepository<
  IMasterProfilePublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(id: string): Promise<IMasterProfileEntity | null>;
  create(input: ICreateMasterProfileInput): Promise<IMasterProfileEntity>;
  update(
    id: string,
    input: IUpdateMasterProfileInput,
  ): Promise<IMasterProfileEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
