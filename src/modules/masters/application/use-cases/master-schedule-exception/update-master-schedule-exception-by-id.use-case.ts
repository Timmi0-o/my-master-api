import type { IUpdateMasterScheduleExceptionApplicationInput } from '../../dtos/master-schedule-exception/update-master-schedule-exception.input';
import type { IUpdateMasterScheduleExceptionApplicationOutput } from '../../dtos/master-schedule-exception/update-master-schedule-exception.output';
import { ensureMasterScheduleExceptionExists } from 'src/modules/masters/domain/entities/master-schedule-exception';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class UpdateMasterScheduleExceptionByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterScheduleExceptionApplicationInput,
  ): Promise<IUpdateMasterScheduleExceptionApplicationOutput> {
    const existing = await this.masterScheduleExceptionRepository.findEntityById(input.id);
    ensureMasterScheduleExceptionExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.masterScheduleExceptionRepository.update(input.id, input.patch, scope),
    );
  }
}
