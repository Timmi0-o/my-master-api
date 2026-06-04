import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { GetMasterWeeklySchedulesOutput } from '../../dtos/master-weekly-schedule/get-master-weekly-schedules.output';

export class GetMasterWeeklySchedulesUseCase {
  constructor(
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IMasterWeeklySchedulePublicEntity,
      IMasterWeeklyScheduleRelations
    >,
  ): Promise<GetMasterWeeklySchedulesOutput> {
    const [items, total] = await Promise.all([
      this.masterWeeklyScheduleRepository.findMany(params),
      this.masterWeeklyScheduleRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
