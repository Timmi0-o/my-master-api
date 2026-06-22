import type { ICreateMasterWeeklyScheduleApplicationInput } from '../../dtos/master-weekly-schedule/create-master-weekly-schedule.input';
import type { ICreateMasterWeeklyScheduleApplicationOutput } from '../../dtos/master-weekly-schedule/create-master-weekly-schedule.output';
import type { ICreateMasterWeeklyScheduleInput } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateMasterWeeklyScheduleUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterWeeklyScheduleApplicationInput,
  ): Promise<ICreateMasterWeeklyScheduleApplicationOutput> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    ensureMasterProfileExists(profile, input.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    const createInput: ICreateMasterWeeklyScheduleInput = {
      masterProfileId: input.masterProfileId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterWeeklyScheduleRepository.create(createInput, scope),
    );
  }
}
