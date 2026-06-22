import type { IDeleteMasterWeeklyScheduleApplicationInput } from '../../dtos/master-weekly-schedule/delete-master-weekly-schedule.input';
import type { IDeleteMasterWeeklyScheduleApplicationOutput } from '../../dtos/master-weekly-schedule/delete-master-weekly-schedule.output';
import { ensureMasterWeeklyScheduleExists } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class DeleteMasterWeeklyScheduleByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteMasterWeeklyScheduleApplicationInput,
  ): Promise<IDeleteMasterWeeklyScheduleApplicationOutput> {
    const existing = await this.masterWeeklyScheduleRepository.findEntityById(input.id);
    ensureMasterWeeklyScheduleExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterWeeklyScheduleRepository.softDelete(input.id, scope),
    );
  }
}
