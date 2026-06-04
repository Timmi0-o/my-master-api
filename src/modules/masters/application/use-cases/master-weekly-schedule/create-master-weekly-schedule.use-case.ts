import type { ICreateMasterWeeklyScheduleApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/create-master-weekly-schedule.input';
import type {
  ICreateMasterWeeklyScheduleInput,
  IMasterWeeklyScheduleEntity,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class CreateMasterWeeklyScheduleUseCase {
  constructor(
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterWeeklyScheduleApplicationInput,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(input.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    const createInput: ICreateMasterWeeklyScheduleInput = {
      masterProfileId: input.masterProfileId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
    };

    return this.masterWeeklyScheduleRepository.create(createInput);
  }
}
