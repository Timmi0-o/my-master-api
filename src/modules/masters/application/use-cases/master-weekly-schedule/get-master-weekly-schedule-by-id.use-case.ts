import { MasterWeeklyScheduleNotFoundError } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { IGetMasterWeeklyScheduleByIdApplicationInput } from '../../dtos/master-weekly-schedule/get-master-weekly-schedule-by-id.input';
import type { IGetMasterWeeklyScheduleByIdApplicationOutput } from '../../dtos/master-weekly-schedule/get-master-weekly-schedule-by-id.output';

export class GetMasterWeeklyScheduleByIdUseCase {
  constructor(
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
  ) {}

  async execute(
    input: IGetMasterWeeklyScheduleByIdApplicationInput,
  ): Promise<IGetMasterWeeklyScheduleByIdApplicationOutput> {
    const entity = await this.masterWeeklyScheduleRepository.findEntityById(
      input.id,
    );
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterWeeklyScheduleNotFoundError(input.id);
    }

    const item = await this.masterWeeklyScheduleRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new MasterWeeklyScheduleNotFoundError(input.id);
    }
    return item;
  }
}
