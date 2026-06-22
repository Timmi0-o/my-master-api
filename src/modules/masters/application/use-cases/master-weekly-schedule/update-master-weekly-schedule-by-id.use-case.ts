import type { IUpdateMasterWeeklyScheduleApplicationInput } from '../../dtos/master-weekly-schedule/update-master-weekly-schedule.input';
import type { IUpdateMasterWeeklyScheduleApplicationOutput } from '../../dtos/master-weekly-schedule/update-master-weekly-schedule.output';
import { ensureMasterWeeklyScheduleExists } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class UpdateMasterWeeklyScheduleByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterWeeklyScheduleApplicationInput,
  ): Promise<IUpdateMasterWeeklyScheduleApplicationOutput> {
    const existing = await this.masterWeeklyScheduleRepository.findEntityById(input.id);
    ensureMasterWeeklyScheduleExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterWeeklyScheduleRepository.update(input.id, input.patch, scope),
    );
  }
}
