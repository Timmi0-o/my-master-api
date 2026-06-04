import type { IUpdateMasterScheduleExceptionApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/update-master-schedule-exception.input';
import type { IMasterScheduleExceptionEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterScheduleExceptionNotFoundError } from 'src/modules/masters/domain/errors/master-schedule-exception-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class UpdateMasterScheduleExceptionByIdUseCase {
  constructor(
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IUpdateMasterScheduleExceptionApplicationInput,
  ): Promise<IMasterScheduleExceptionEntity> {
    const existing =
      await this.masterScheduleExceptionRepository.findEntityById(input.id);
    if (!existing) {
      throw new MasterScheduleExceptionNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(existing.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    return this.masterScheduleExceptionRepository.update(input.id, input.patch);
  }
}
