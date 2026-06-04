import type { IDeleteMasterWeeklyScheduleApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/delete-master-weekly-schedule.input';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterWeeklyScheduleNotFoundError } from 'src/modules/masters/domain/errors/master-weekly-schedule-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class DeleteMasterWeeklyScheduleByIdUseCase {
  constructor(
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IDeleteMasterWeeklyScheduleApplicationInput,
  ): Promise<void> {
    const existing = await this.masterWeeklyScheduleRepository.findEntityById(
      input.id,
    );
    if (!existing) {
      throw new MasterWeeklyScheduleNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(existing.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    await this.masterWeeklyScheduleRepository.softDeleteById(input.id);
  }
}
