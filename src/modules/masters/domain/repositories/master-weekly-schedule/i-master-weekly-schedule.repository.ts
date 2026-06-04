import type { IReadRepository } from 'src/modules/shared/domain/repositories';
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
> & {
  findEntityById(id: string): Promise<IMasterWeeklyScheduleEntity | null>;
  create(
    input: ICreateMasterWeeklyScheduleInput,
  ): Promise<IMasterWeeklyScheduleEntity>;
  update(
    id: string,
    input: IUpdateMasterWeeklyScheduleInput,
  ): Promise<IMasterWeeklyScheduleEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
