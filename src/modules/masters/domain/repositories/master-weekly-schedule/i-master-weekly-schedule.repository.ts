import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterWeeklyScheduleInput,
  IMasterWeeklyScheduleEntity,
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
  IUpdateMasterWeeklyScheduleInput,
} from '../../entities/master-weekly-schedule';

export type IMasterWeeklyScheduleRepository = IReadRepository<
  IMasterWeeklySchedulePublicEntity,
  string,
  IMasterWeeklyScheduleRelations
> &
  ICreateRepository<
    IMasterWeeklyScheduleEntity,
    ICreateMasterWeeklyScheduleInput
  > &
  IUpdateRepository<
    IMasterWeeklyScheduleEntity,
    string,
    IUpdateMasterWeeklyScheduleInput
  > &
  ISoftDeleteRepository<IMasterWeeklyScheduleEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterWeeklyScheduleEntity | null>;
  };
