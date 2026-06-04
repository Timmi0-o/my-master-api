import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type {
  ICreateMasterScheduleExceptionInput,
  IMasterScheduleExceptionEntity,
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
  IUpdateMasterScheduleExceptionInput,
} from '../../entities/master-schedule-exception';

export type IMasterScheduleExceptionRepository = IReadRepository<
  IMasterScheduleExceptionPublicEntity,
  string,
  IMasterScheduleExceptionRelations
> & {
  findEntityById(id: string): Promise<IMasterScheduleExceptionEntity | null>;
  create(
    input: ICreateMasterScheduleExceptionInput,
  ): Promise<IMasterScheduleExceptionEntity>;
  update(
    id: string,
    input: IUpdateMasterScheduleExceptionInput,
  ): Promise<IMasterScheduleExceptionEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
