import type { ICreateMasterScheduleExceptionApplicationInput } from '../../dtos/master-schedule-exception/create-master-schedule-exception.input';
import type { ICreateMasterScheduleExceptionApplicationOutput } from '../../dtos/master-schedule-exception/create-master-schedule-exception.output';
import type { ICreateMasterScheduleExceptionInput } from 'src/modules/masters/domain/entities/master-schedule-exception';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { ITransactionManager } from '@shared/domain/transactions';

export class CreateMasterScheduleExceptionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterScheduleExceptionApplicationInput,
  ): Promise<ICreateMasterScheduleExceptionApplicationOutput> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    ensureMasterProfileExists(profile, input.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    const createInput: ICreateMasterScheduleExceptionInput = {
      masterProfileId: input.masterProfileId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      kind: input.kind,
      customStartTime: input.customStartTime ?? null,
      customEndTime: input.customEndTime ?? null,
      title: input.title ?? null,
      note: input.note ?? null,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterScheduleExceptionRepository.create(createInput, scope),
    );
  }
}
