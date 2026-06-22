import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
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
> &
  ICreateRepository<
    IMasterScheduleExceptionEntity,
    ICreateMasterScheduleExceptionInput
  > &
  IUpdateRepository<
    IMasterScheduleExceptionEntity,
    string,
    IUpdateMasterScheduleExceptionInput
  > &
  ISoftDeleteRepository<IMasterScheduleExceptionEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterScheduleExceptionEntity | null>;
  };
